'use strict';

class Collector {
  done = false;
  data = {};
  keys = [];
  count = 0;
  exact = true;
  reassign = true;
  timeout = 0;
  #fulfill = null;
  #reject = null;
  #cause = null;
  #controller = null;
  #signal = null;
  #timeout = null;

  constructor(keys, { exact = true, timeout = 0, reassign = false } = {}) {
    this.keys = keys;
    if (exact === false) this.exact = false;
    if (reassign === false) this.reassign = reassign;
    this.#controller = new AbortController();
    this.#signal = this.#controller.signal;
    if (typeof timeout === 'number' && timeout > 0) {
      this.#timeout = AbortSignal.timeout(timeout);
      this.#signal = AbortSignal.any([this.#signal, this.#timeout]);
      this.#timeout.addEventListener('abort', () => {
        if (this.done) return;
        this.fail(this.#timeout.reason);
      });
    }
  }

  get signal() {
    return this.#controller.signal;
  }

  set(key, value) {
    if (this.done) return;
    const expected = this.keys.includes(key);
    if (!expected && this.exact) {
      this.fail(new Error('Unexpected key: ' + key));
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
      this.#timeout = null;
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
    const promise = fn instanceof Promise ? fn : fn(...args);
    promise.then(
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
    this.#timeout = null;
    const err = error || new Error('Collector aborted');
    this.#cause = err;
    this.#controller.abort();
    if (this.#reject) this.#reject(err);
  }

  abort() {
    this.fail();
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
