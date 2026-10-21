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
      validate = null,
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
    if (validate !== null && typeof validate !== 'function') {
      throw new TypeError('Collector: validate must be a function');
    }

    this.#keys = [...keys];
    this.#exact = exact !== false;
    this.#reassign = reassign === true;
    this.#timeout = timeout;
    this.#defaults = { ...defaults };
    this.#validate = validate;
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
      if (error !== null && error !== undefined) this.fail(error);
      else this.set(key, data);
    });
  }

  wait(key, fn, ...args) {
    const promise = typeof fn.then === 'function' ? fn : fn(...args);
    this.#await(key, promise);
  }

  collect(sources) {
    const keys = Object.keys(sources);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      this.#await(key, sources[key]);
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
      if (this.#done) this.#tryResolve();
    }).then(onFulfilled, onRejected);
  }

  #await(key, thenable) {
    thenable.then(
      (data) => void this.set(key, data),
      (error) => void this.fail(error),
    );
  }

  #startTimeout() {
    if (this.#timeout <= 0) return;
    this.#timer = setTimeout(() => this.#expire(), this.#timeout);
  }

  #expire() {
    this.#timer = null;
    this.#applyDefaults();
    const reason = new DOMException(
      'The operation was aborted due to timeout',
      'TimeoutError',
    );
    if (this.#done) this.#controller.abort(reason);
    else this.#rejectWith(reason, reason);
  }

  #stopTimeout() {
    if (this.#timer !== null) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
  }

  #applyDefaults() {
    const defaults = this.#defaults;
    const keys = Object.keys(defaults);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (this.#data[key] === undefined) this.set(key, defaults[key]);
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
    this.#validateData();
    this.#tryResolve();
  }

  #validateData() {
    if (this.#validate === null) return;
    try {
      this.#validate(this.#data);
    } catch (error) {
      this.#cause = error;
    }
  }

  #tryResolve() {
    if (this.#cause !== null) {
      if (this.#reject !== null) this.#reject(this.#cause);
    } else if (this.#fulfill !== null) {
      this.#fulfill({ ...this.#data });
    }
  }

  #rejectWith(error = null, reason = undefined) {
    this.#done = true;
    this.#stopTimeout();
    const cause = error ?? new Error('Collector aborted');
    this.#cause = cause;
    this.#controller.abort(reason);
    if (this.#reject !== null) this.#reject(cause);
  }
}

const collect = (keys, options) => new Collector(keys, options);

module.exports = { Collector, collect };
