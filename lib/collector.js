'use strict';

class Collector {
  done = false;
  data = {};
  keys = [];
  count = 0;
  exact = true;
  reassign = false;
  timeout = 0;
  defaults = {};
  validate = null;
  #fulfill = null;
  #reject = null;
  #cause = null;
  #controller = null;
  #signal = null;

  constructor(keys, options = {}) {
    const { exact = true, reassign = false } = options;
    const { timeout = 0, defaults = {}, validate = null } = options;
    this.validate = validate;
    this.keys = keys;
    this.exact = Boolean(exact);
    this.reassign = Boolean(reassign);
    if (typeof defaults === 'object') this.defaults = defaults;
    this.#controller = new AbortController();
    this.#signal = this.#controller.signal;
    if (typeof timeout === 'number') {
      this.timeout = timeout;
      if (timeout > 0) {
        const timer = AbortSignal.timeout(timeout);
        this.#signal = AbortSignal.any([this.#signal, timer]);
        this.#signal.addEventListener('abort', () => {
          this.#default();
          if (this.done) return;
          this.fail(this.#signal.reason);
        });
      }
    }
  }

  #default() {
    const { defaults, data } = this;
    const keys = Object.keys(defaults);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (data[key] === undefined) this.set(key, defaults[key]);
    }
  }

  get signal() {
    return this.#signal;
  }

  set(key, value) {
    if (this.done) return;
    const expected = this.keys.includes(key);
    if (!expected && this.exact) {
      this.fail(new Error(`Unexpected key: ${key}`));
      return;
    }
    const has = this.data[key] !== undefined;
    if (has && !this.reassign) {
      const error = new Error('Collector reassign mode is off');
      return void this.fail(error);
    }
    if (!has && expected) this.count++;
    this.data[key] = value;
    if (this.count === this.keys.length) {
      this.done = true;
      if (this.validate !== null) {
        try {
          this.validate(this.data);
        } catch (error) {
          this.#cause = error;
        }
      }
      this.#finish();
    }
  }

  take(key, fn, ...args) {
    fn(...args, (error, data) => {
      if (error !== null && error !== undefined) this.fail(error);
      else this.set(key, data);
    });
  }

  wait(key, fn, ...args) {
    const promise = fn instanceof Promise ? fn : fn(...args);
    this.#await(key, promise);
  }

  collect(sources) {
    const keys = Object.keys(sources);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      this.#await(key, sources[key]);
    }
  }

  #await(key, thenable) {
    thenable.then(
      (data) => this.set(key, data),
      (error) => this.fail(error),
    );
  }

  fail(error) {
    this.done = true;
    const cause = error ?? new Error('Collector aborted');
    this.#cause = cause;
    this.#controller.abort();
    if (this.#reject !== null) this.#reject(cause);
  }

  abort() {
    this.fail();
  }

  #finish() {
    if (this.#cause !== null) {
      if (this.#reject !== null) this.#reject(this.#cause);
    } else if (this.#fulfill !== null) {
      this.#fulfill(this.data);
    }
  }

  then(onFulfilled, onRejected = null) {
    return new Promise((resolve, reject) => {
      this.#fulfill = resolve;
      this.#reject = reject;
      if (this.done) this.#finish();
    }).then(onFulfilled, onRejected);
  }
}

const collect = (keys, options) => new Collector(keys, options);

module.exports = { Collector, collect };
