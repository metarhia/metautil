'use strict';

class Collector {
  #done = null;
  #fail = null;
  #fulfill = null;
  #reject = null;
  #timer = null;

  constructor(keys, options = {}) {
    this.done = false;
    this.data = {};
    this.count = 0;
    this.keys = keys;
    this.options = options;
    if (options.timeout) this.timeout(options.timeout);
    if (options.distinct === undefined) options.distinct = true;
  }

  timeout(msec) {
    if (this.#timer) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
    if (msec > 0) {
      this.#timer = setTimeout(() => {
        const error = new Error('Collector timed out');
        this.fail(error);
      }, msec);
    }
    return this;
  }

  distinct(value = true) {
    this.options.distinct = value;
    return this;
  }

  on(name, callback) {
    if (name === 'done') this.#done = callback;
    else if (name === 'fail') this.#fail = callback;
  }

  pick(key, value) {
    if (this.done) return;
    const has = this.data[key] !== undefined;
    const expected = this.keys.includes(key);
    if (!expected && this.options.distinct) {
      const error = new Error('Unexpected key: ' + key);
      return void this.fail(error);
    }
    if (!has && expected) this.count++;
    this.data[key] = value;
    if (this.count === this.keys.length) {
      this.done = true;
      if (this.#done) this.#done(this.data);
      if (this.#fulfill) this.#fulfill(this.data);
    }
  }

  fail(error) {
    const err = error || new Error('Collector cancelled');
    if (this.#fail) this.#fail(err);
    if (this.#reject) this.#reject(err);
  }

  then(fulfill, reject = null) {
    this.#fulfill = fulfill;
    this.#reject = reject;
  }
}

const collect = (keys, options) => new Collector(keys, options);

module.exports = { Collector, collect };
