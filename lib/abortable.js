'use strict';

const { EventEmitter } = require('node:events');

const LONG_DELAY = 60000;
class Abortable extends EventEmitter {
  #timeoutAc;
  #taskAc;
  #timeout;
  constructor(delay = LONG_DELAY, throwOnAborted = false) {
    super();
    this.delay = delay;
    this.throwOnAborted = throwOnAborted;
    this.#taskAc = new AbortController();
    this.#timeoutAc = new AbortController();
    this.#timeout = null;
  }

  get aborted() {
    return this.#taskAc.signal.aborted;
  }

  get reason() {
    return this.#taskAc.signal.reason;
  }

  async run(task, ...args) {
    this.emit('running');
    try {
      return await Promise.race([
        this.#abortTimeout(),
        this.#task(task, ...args),
      ]);
    } catch (error) {
      if (error === this.reason) {
        this.emit('aborted', this.reason);
        if (!this.throwOnAborted) return Promise.resolve();
      }
      return Promise.reject(error);
    }
  }

  abort(reason = null) {
    this.#taskAc.abort(reason ? new Error(reason) : undefined);
  }

  throwIfAborted() {
    this.#taskAc.signal.throwIfAborted();
  }

  resetTimeout(delay) {
    if (!this.#timeout) return;
    clearTimeout(this.#timeout);
    this.#timeout = this.#setTimeout(delay);
  }

  #abortTimeout() {
    const { signal } = this.#timeoutAc;
    if (signal.aborted) return Promise.reject(signal.reason);
    if (this.#timeout) clearTimeout(this.#timeout);
    this.#timeout = this.#setTimeout();
    const abortCallback = () => {
      clearTimeout(this.#timeout);
      this.#timeout = null;
    };
    return new Promise((_, reject) => {
      this.once('timeout', () => reject(this.reason));
      signal.addEventListener('abort', abortCallback, { once: true });
    });
  }

  #setTimeout(delay = null) {
    if (delay) this.delay = delay;
    return setTimeout(() => {
      this.#timeout = null;
      this.abort(`Task aborted after ${this.delay}ms`);
      this.emit('timeout');
    }, this.delay);
  }

  async #task(task, ...args) {
    const wrapper = (task, options = {}) => {
      if (args.length < task.length)
        return Promise.reject(
          new Error(`Invalid number of ${task.name} arguments`),
        );
      const { signal } = { ...options };
      if (signal?.constructor.name !== 'AbortSignal')
        return Promise.reject(new Error('Task AbortSignal is not defined'));
      if (signal.aborted) return Promise.reject(signal.reason);
      return new Promise((resolve, reject) => {
        const taskDone = new AbortController();
        const abortCallback = () => {
          reject(signal.reason);
          resolve = null;
          reject = null;
        };
        signal.addEventListener('abort', abortCallback, {
          once: true,
          signal: taskDone.signal,
        });
        task(...args)
          .then(resolve, reject)
          .finally(() => {
            taskDone.abort();
          });
      });
    };
    try {
      const { signal } = this.#taskAc;
      return await wrapper(task, { signal });
    } finally {
      this.#timeoutAc.abort();
    }
  }
}

module.exports = { Abortable };
