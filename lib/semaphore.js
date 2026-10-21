'use strict';

class Semaphore {
  constructor({ concurrency, size = 0, timeout = 0 }) {
    this.concurrency = concurrency;
    this.counter = concurrency;
    this.timeout = timeout;
    this.size = size;
    this.queue = [];
  }

  get empty() {
    return this.queue.length === 0 && this.counter === this.concurrency;
  }

  enter() {
    return new Promise((resolve, reject) => {
      if (this.counter > 0) {
        this.counter--;
        return void resolve();
      }
      if (this.queue.length >= this.size) {
        return void reject(new Error('Semaphore queue is full'));
      }
      const waiting = { resolve, timer: null };
      if (this.timeout > 0) {
        waiting.timer = setTimeout(() => {
          const position = this.queue.indexOf(waiting);
          this.queue.splice(position, 1);
          reject(new Error('Semaphore timeout'));
        }, this.timeout);
      }
      this.queue.push(waiting);
    });
  }

  leave() {
    if (this.queue.length === 0) {
      this.counter++;
      return;
    }
    const { resolve, timer } = this.queue.shift();
    clearTimeout(timer);
    resolve();
  }
}

module.exports = { Semaphore };
