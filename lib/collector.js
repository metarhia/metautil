'use strict';

class Collector {
  #done = false;
  #data = {};
  #keys = [];
  #count = 0;
  #exact = true;
  #reassign = false;
  #timeout = 0;
  #defaults = {};
  #validate = null;
  #fulfill = null;
  #reject = null;
  #cause = null;
  #controller = null;
  #timer = null;

  constructor(keys, options = {}) {
    if (!Array.isArray(keys)) {
      throw new TypeError('Collector: keys must be an array');
    }
    for (const key of keys) {
      if (typeof key !== 'string' && typeof key !== 'symbol') {
        throw new TypeError('Collector: key must be a string or symbol');
      }
    }

    const {
      exact = true,
      reassign = false,
      timeout = 0,
      defaults = {},
      validate,
    } = options;

    if (
      typeof timeout !== 'number' ||
      timeout < 0 ||
      !Number.isFinite(timeout)
    ) {
      throw new TypeError('Collector: timeout must be a non-negative number');
    }
    if (
      defaults === null ||
      typeof defaults !== 'object' ||
      Array.isArray(defaults)
    ) {
      throw new TypeError('Collector: defaults must be a plain object');
    }
    if (validate !== undefined && typeof validate !== 'function') {
      throw new TypeError('Collector: validate must be a function');
    }

    this.#keys = [...keys];
    this.#exact = exact !== false;
    this.#reassign = reassign === true;
    this.#timeout = timeout;
    this.#defaults = { ...defaults };
    if (validate) this.#validate = validate;
    this.#controller = new AbortController();
    this.#startTimeout();
  }

  get done() {
    return this.#done;
  }

  get count() {
    return this.#count;
  }

  get keys() {
    return [...this.#keys];
  }

  get data() {
    return { ...this.#data };
  }

  get signal() {
    return this.#controller.signal;
  }

  set(key, value) {
    if (this.#done) return;
    const expected = this.#isExpected(key);
    if (!expected && this.#exact) {
      this.fail(new Error(`Unexpected key: ${key}`));
      return;
    }
    const has = this.#hasValue(key);
    if (has && !this.#reassign) {
      this.fail(new Error('Collector reassign mode is off'));
      return;
    }
    if (!has && expected) this.#count++;
    this.#data[key] = value;
    if (this.#count === this.#keys.length) {
      this.#complete();
    }
  }

  take(key, fn, ...args) {
    fn(...args, (error, data) => {
      if (error) this.fail(error);
      else this.set(key, data);
    });
  }

  wait(key, fn, ...args) {
    const promise = typeof fn.then === 'function' ? fn : fn(...args);
    promise.then(
      (data) => void this.set(key, data),
      (error) => void this.fail(error),
    );
  }

  collect(sources) {
    for (const entry of Object.entries(sources)) {
      const key = entry[0];
      const collector = entry[1];
      collector.then(
        (data) => void this.set(key, data),
        (error) => void this.fail(error),
      );
    }
  }

  fail(error) {
    this.#rejectWith(error);
  }

  abort() {
    this.fail();
  }

  then(onFulfilled, onRejected = null) {
    return new Promise((resolve, reject) => {
      this.#fulfill = resolve;
      this.#reject = reject;
      if (!this.#done) return;
      this.#tryResolve();
    }).then(onFulfilled, onRejected);
  }

  #startTimeout() {
    if (this.#timeout <= 0) return;
    this.#timer = setTimeout(() => {
      this.#timer = null;
      if (Object.keys(this.#defaults).length > 0) this.#applyDefaults();
      if (this.#done) return;
      const error = new Error('The operation was aborted due to timeout');
      error.name = 'TimeoutError';
      this.fail(error);
    }, this.#timeout);
  }

  #stopTimeout() {
    if (this.#timer !== null) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
  }

  #applyDefaults() {
    for (const entry of Object.entries(this.#defaults)) {
      const key = entry[0];
      const value = entry[1];
      if (this.#data[key] === undefined) this.set(key, value);
    }
  }

  #isExpected(key) {
    return this.#keys.includes(key);
  }

  #hasValue(key) {
    return this.#data[key] !== undefined;
  }

  #complete() {
    this.#done = true;
    this.#stopTimeout();
    this.#tryResolve();
  }

  #validateData() {
    if (!this.#validate) return;
    try {
      this.#validate(this.#data);
    } catch (error) {
      this.#cause = error;
    }
  }

  #tryResolve() {
    if (this.#cause) {
      if (this.#reject) this.#reject(this.#cause);
      return;
    }
    if (!this.#fulfill) return;
    this.#validateData();
    if (this.#cause) {
      if (this.#reject) this.#reject(this.#cause);
      return;
    }
    this.#fulfill({ ...this.#data });
  }

  #rejectWith(error = null) {
    this.#done = true;
    this.#stopTimeout();
    const cause = error || new Error('Collector aborted');
    this.#cause = cause;
    this.#controller.abort(cause);
    if (this.#reject) this.#reject(cause);
  }
}

const collect = (keys, options) => new Collector(keys, options);

module.exports = { Collector, collect };
