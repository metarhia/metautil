'use strict';

class Semaphore {
  constructor(concurrency, size = 0, timeout = 0) {
    this.concurrency = concurrency;
    this.counter = concurrency;
    this.timeout = timeout;
    this.size = size;
    this.queue = [];
    this.empty = true;
  }

  async enter() {
    return new Promise((resolve, reject) => {
      if (this.counter > 0) {
        this.counter--;
        this.empty = false;
        return void resolve();
      }
      if (this.queue.length >= this.size) {
        return void reject(new Error('Semaphore queue is full'));
      }
      const waiting = { resolve, timer: null };
      waiting.timer = setTimeout(() => {
        waiting.resolve = null;
        this.queue.shift();
        const { counter, concurrency } = this;
        this.empty = this.queue.length === 0 && counter === concurrency;
        reject(new Error('Semaphore timeout'));
      }, this.timeout);
      this.queue.push(waiting);
      this.empty = false;
    });
  }

  leave() {
    if (this.queue.length === 0) {
      this.counter++;
      this.empty = this.counter === this.concurrency;
      return;
    }
    const { resolve, timer } = this.queue.shift();
    clearTimeout(timer);
    if (resolve) setTimeout(resolve, 0);
    const { counter, concurrency } = this;
    this.empty = this.queue.length === 0 && counter === concurrency;
  }
}

module.exports = { Semaphore };
