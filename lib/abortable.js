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
    if (this.#timeoutAc.signal.aborted)
      return Promise.reject(this.#timeoutAc.signal.reason);
    if (this.#timeout) clearTimeout(this.#timeout);
    this.#timeout = this.#setTimeout();
    return new Promise((_, reject) => {
      this.once('timeout', () => reject(this.reason));
      this.#timeoutAc.signal.addEventListener('abort', () => {
        clearTimeout(this.#timeout);
        this.#timeout = null;
      });
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
    const wrapper = (task, self, options = {}) => {
      if (args.length < task.length)
        return Promise.reject(
          new Error(`Invalid number of ${task.name} arguments`),
        );
      const { signal } = { ...options };
      if (!signal || signal.constructor.name !== 'AbortSignal')
        return Promise.reject(new Error('Task AbortSignal is not defined'));
      if (signal.aborted) return Promise.reject(signal.reason);
      return new Promise((resolve, reject) => {
        const taskDone = new AbortController();
        signal.addEventListener(
          'abort',
          () => {
            signal.dispatchEvent(new Event('aborted'));
          },
          {
            once: true,
            signal: taskDone.signal,
          },
        );
        args.push(self);
        task(...args)
          .then(resolve)
          .catch(reject)
          .finally(() => {
            taskDone.abort();
          });
      });
    };
    try {
      return await wrapper(task, this, { signal: this.#taskAc.signal });
    } finally {
      this.#timeoutAc.abort();
    }
  }
}

module.exports = { Abortable };
