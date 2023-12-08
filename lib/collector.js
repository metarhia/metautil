'use strict';

class Collector {
  done = false;
  data = {};
  keys = [];
  count = 0;
  exact = true;
  timeout = 0;
  mode = 'all';
  #done = null;
  #error = null;
  #fulfill = null;
  #reject = null;
  #timer = null;
  #cause = null;

  constructor(keys, { exact = true, timeout = 0, mode = 'all' } = {}) {
    this.keys = keys;
    this.mode = mode;
    if (exact === false) this.exact = false;
    if (typeof timeout === 'number') this.#timeout(timeout);
  }

  static #getSettled(err = null, value = null) {
    if (err) {
      return { status: 'rejected', reason: err };
    }
    return { status: 'fulfilled', value };
  }

  #setData(key, data) {
    if (this.mode === 'allSettled') {
      this.set(key, Collector.#getSettled(null, data));
      return;
    }
    this.set(key, data);
  }

  #setError(key, err) {
    if (this.mode === 'allSettled') {
      this.set(key, Collector.#getSettled(err));
      return;
    }
    this.fail(err);
  }

  #timeout(msec) {
    this.timeout = msec;
    if (this.#timer) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
    if (msec === 0) return;
    const handler = () => this.fail(new Error('Collector timed out'));
    this.#timer = setTimeout(handler, msec);
  }

  on(name, callback) {
    if (name === 'done') this.#done = callback;
    else if (name === 'error') this.#error = callback;
    if (this.done) {
      if (name === 'error' && this.#cause) callback(this.#cause);
      else if (name === 'done') callback(this.data);
    }
  }

  set(key, value) {
    if (this.done) return;
    const has = this.data[key] !== undefined;
    const expected = this.keys.includes(key);
    if (!expected && this.exact) {
      this.fail(new Error('Unexpected key: ' + key));
      return;
    }
    if (!has && expected) this.count++;
    this.data[key] = value;
    if (this.count === this.keys.length) {
      this.done = true;
      this.#timeout(0);
      if (this.#done) this.#done(this.data);
      if (this.#fulfill) this.#fulfill(this.data);
    }
  }

  take(key, fn, ...args) {
    fn(...args, (err, data) => {
      if (err) this.#setError(key, err);
      else this.#setData(key, data);
    });
  }

  wait(key, fn, ...args) {
    fn(...args).then(
      (data) => this.#setData(key, data),
      (err) => this.#setError(key, err),
    );
  }

  collect(sources) {
    for (const [key, collector] of Object.entries(sources)) {
      collector.then(
        (data) => this.#setData(key, data),
        (err) => this.#setError(err),
      );
    }
  }

  fail(error) {
    this.done = true;
    this.#timeout(0);
    const err = error || new Error('Collector cancelled');
    this.#cause = err;
    if (this.#error) this.#error(err);
    if (this.#reject) this.#reject(err);
  }

  then(fulfill, reject = null) {
    this.#fulfill = fulfill;
    this.#reject = reject;
    if (this.done) {
      if (reject && this.#cause) reject(this.#cause);
      else if (fulfill) fulfill(this.data);
    }
  }
}

const collect = (keys, options) => new Collector(keys, options);

module.exports = { Collector, collect };
