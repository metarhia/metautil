'use strict';

class Collector {
  done = false;
  data = {};
  keys = [];
  count = 0;
  exact = true;
  timeout = 0;
  defaultValue = {};
  #fulfill = null;
  #reject = null;
  #timer = null;
  #cause = null;

  constructor(keys, { exact = true, defaultValue = {}, timeout = 0 } = {}) {
    this.keys = keys;
    if (exact === false) this.exact = false;
    if (typeof timeout === 'number') this.#timeout(timeout);
    if (typeof defaultValue === 'object') this.defaultValue = defaultValue;
  }

  #timeout(msec) {
    this.timeout = msec;
    if (this.#timer) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
    if (msec === 0) return;
    const handler = () => {
      if (Object.keys(this.defaultValue).length === 0) {
        return void this.fail(new Error('Collector timed out'));
      }
      if (Object.keys(this.data).length === 0) this.#default();
    };
    this.#timer = setTimeout(handler, msec);
  }

  #default() {
    for (const [key, value] of Object.entries(this.defaultValue)) {
      this.set(key, value);
    }
    if (!this.done) {
      return void this.fail(new Error('Not enough default values'));
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
      if (this.#fulfill) this.#fulfill(this.data);
    }
  }

  take(key, fn, ...args) {
    fn(...args, (err, data) => {
      if (err) this.fail(err);
      else this.set(key, data);
    });
  }

  wait(key, fn, ...args) {
    fn(...args).then(
      (data) => this.set(key, data),
      (err) => this.fail(err),
    );
  }

  collect(sources) {
    for (const [key, collector] of Object.entries(sources)) {
      collector.then(
        (data) => this.set(key, data),
        (err) => this.fail(err),
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

const collect = (keys, options) => new Collector(keys, options);

module.exports = { Collector, collect };
