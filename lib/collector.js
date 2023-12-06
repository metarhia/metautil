'use strict';

class Collector {
  done = false;
  data = {};
  keys = [];
  count = 0;
  exact = true;
  timeout = 0;
  #done = null;
  #error = null;
  #fulfill = null;
  #reject = null;
  #timer = null;

  constructor(keys, { exact = true, timeout = 0 } = {}) {
    this.keys = keys;
    if (exact === false) this.exact = false;
    if (typeof timeout === 'number') this.#timeout(timeout);
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
  }

  pick(key, value) {
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

  fail(error) {
    this.done = true;
    this.#timeout(0);
    const err = error || new Error('Collector cancelled');
    if (this.#error) this.#error(err);
    if (this.#reject) this.#reject(err);
    if (!this.#error && !this.#reject) throw err;
  }

  then(fulfill, reject = null) {
    this.#fulfill = fulfill;
    this.#reject = reject;
  }
}

const collect = (keys, options) => new Collector(keys, options);

module.exports = { Collector, collect };
