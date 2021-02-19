'use strict';

class Semaphore {
  constructor(concurrency, size, timeout) {
    this.counter = concurrency;
    this.timeout = timeout;
    this.size = size;
    this.queue = [];
  }

  enter() {
    return new Promise((resolve, reject) => {
      if (this.counter > 0) {
        this.counter--;
        resolve();
        return;
      }
      if (this.queue.length >= this.size) {
        reject(new Error('Semaphore queue is full'));
        return;
      }
      const waiting = { resolve };
      waiting.timer = setTimeout(() => {
        waiting.resolve = null;
        reject(new Error('Semaphore timeout'));
      }, this.timeout);
      this.queue.push(waiting);
    });
  }

  leave() {
    this.counter++;
    if (this.queue.length === 0) return;
    const { resolve, timer } = this.queue.shift();
    clearTimeout(timer);
    setTimeout(() => {
      if (resolve) resolve();
    }, 0);
  }
}

module.exports = { Semaphore };
