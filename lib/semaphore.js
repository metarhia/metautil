'use strict';

class Semaphore {
  #concurrency = 0;
  #available = 0;
  #timeout = 0;
  #queueLimit = 0;
  #queue = [];

  constructor({ concurrency, size = 0, timeout = 0 }) {
    if (!Number.isInteger(concurrency) || concurrency <= 0) {
      throw new TypeError('Semaphore: concurrency must be a positive integer');
    }
    if (!Number.isInteger(size) || size < 0) {
      throw new TypeError('Semaphore: size must be a positive integer');
    }
    if (!Number.isInteger(timeout) || timeout < 0) {
      throw new TypeError('Semaphore: timeout must be a positive number');
    }
    this.#concurrency = concurrency;
    this.#available = concurrency;
    this.#queueLimit = size;
    this.#timeout = timeout;
  }

  get concurrency() {
    return this.#concurrency;
  }

  get available() {
    return this.#available;
  }

  get queueLimit() {
    return this.#queueLimit;
  }

  get pending() {
    return this.#queue.length;
  }

  get empty() {
    return this.#isEmpty();
  }

  enter() {
    return new Promise((resolve, reject) => {
      if (this.#hasAvailableSlot()) {
        this.#available--;
        resolve();
        return;
      }
      if (this.#isQueueFull()) {
        reject(new Error('Semaphore queue is full'));
        return;
      }
      this.#enqueue(resolve, reject);
    });
  }

  leave() {
    if (this.#queue.length === 0) {
      if (this.#available < this.#concurrency) {
        this.#available++;
      }
      return;
    }
    this.#dequeue();
  }

  #hasAvailableSlot() {
    return this.#available > 0;
  }

  #isQueueFull() {
    return this.#queue.length >= this.#queueLimit;
  }

  #isEmpty() {
    return this.#queue.length === 0 && this.#available === this.#concurrency;
  }

  #enqueue(resolve, reject) {
    const waiting = { resolve, timer: null };
    waiting.timer = this.#createTimeout(waiting, reject);
    this.#queue.push(waiting);
  }

  #dequeue() {
    const waiting = this.#queue.shift();
    if (!waiting) return;
    clearTimeout(waiting.timer);
    if (waiting.resolve) setTimeout(waiting.resolve, 0);
  }

  #createTimeout(waiting, reject) {
    return setTimeout(() => {
      waiting.resolve = null;
      this.#removeWaiting(waiting);
      reject(new Error('Semaphore timeout'));
    }, this.#timeout);
  }

  #removeWaiting(waiting) {
    const index = this.#queue.indexOf(waiting);
    if (index !== -1) this.#queue.splice(index, 1);
  }
}

module.exports = { Semaphore };
