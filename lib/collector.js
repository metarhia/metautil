'use strict';

class Collector {
  done = false;
  data = {};
  keys = [];
  count = 0;
  exact = true;
  timeout = 0;
  #fulfill = null;
  #reject = null;
  #timer = null;
  #cause = null;

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

  then(onFulfill, onReject = null) {
    return new Promise((resolve, reject) => {
      this.#fulfill = resolve;
      this.#reject = reject;

      if (this.done) {
        if (this.#cause) reject(this.#cause);
        else if (resolve) resolve(this.data);
      }
    }).then(onFulfill, onReject);
  }
}

const collect = (keys, options) => new Collector(keys, options);

module.exports = { Collector, collect };
