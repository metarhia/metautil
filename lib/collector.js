'use strict';

class Collector {
  done = false;
  data = {};
  keys = [];
  count = 0;
  exact = true;
  timeout = 0;
  isRejectable = true;
  #fulfill = null;
  #reject = null;
  #timer = null;
  #cause = null;

  constructor(keys, { exact = true, timeout = 0, isRejectable = true } = {}) {
    this.keys = keys;
    this.isRejectable = isRejectable;
    if (exact === false) this.exact = false;
    if (typeof timeout === 'number') this.#timeout(timeout);
  }

  #setData(key, data) {
    if (!this.isRejectable) {
      this.set(key, getSettled(null, data));
      return;
    }
    this.set(key, data);
  }

  #setError(key, err) {
    if (!this.isRejectable) {
      this.set(key, getSettled(err));
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
        (err) => this.#setError(key, err),
      );
    }
  }

  fail(error) {
    this.done = true;
    this.#timeout(0);
    const err = error || new Error('Collector cancelled');
    this.#cause = err;
    if (this.#reject) this.#reject(err);
  }

  then(onFulfilled, onRejected = null) {
    return new Promise((resolve, reject) => {
      this.#fulfill = resolve;
      this.#reject = reject;
      if (!this.done) return;
      if (this.#cause) reject(this.#cause);
      else resolve(this.data);
    }).then(onFulfilled, onRejected);
  }
}

function getSettled(err = null, value = null) {
  if (err) {
    return { status: 'rejected', reason: err };
  }
  return { status: 'fulfilled', value };
}

const collect = (keys, options) => new Collector(keys, options);

module.exports = { Collector, collect };
