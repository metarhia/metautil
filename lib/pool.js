'use strict';

class Pool {
  constructor(options = {}) {
    this.items = [];
    this.free = [];
    this.queue = [];
    this.timeout = options.timeout || 0;
    this.current = 0;
    this.size = 0;
    this.available = 0;
  }

  async next() {
    if (this.size === 0) return null;
    if (this.available === 0) {
      return new Promise((resolve, reject) => {
        const waiting = { resolve, timer: null };
        waiting.timer = setTimeout(() => {
          waiting.resolve = null;
          this.queue.shift();
          reject(new Error('Pool next item timeout'));
        }, this.timeout);
        this.queue.push(waiting);
      });
    }
    let item = null;
    let free = false;
    do {
      item = this.items[this.current];
      free = this.free[this.current];
      this.current++;
      if (this.current === this.size) this.current = 0;
    } while (!item || !free);
    return item;
  }

  add(item) {
    if (this.items.includes(item)) throw new Error('Pool: add duplicates');
    this.size++;
    this.available++;
    this.items.push(item);
    this.free.push(true);
  }

  async capture() {
    const item = await this.next();
    if (!item) return null;
    const index = this.items.indexOf(item);
    this.free[index] = false;
    this.available--;
    return item;
  }

  release(item) {
    const index = this.items.indexOf(item);
    if (index < 0) throw new Error('Pool: release unexpected item');
    if (this.free[index]) throw new Error('Pool: release not captured');
    this.free[index] = true;
    this.available++;
    if (this.queue.length > 0) {
      const { resolve, timer } = this.queue.shift();
      clearTimeout(timer);
      if (resolve) setTimeout(resolve, 0, item);
    }
  }

  isFree(item) {
    const index = this.items.indexOf(item);
    if (index < 0) return false;
    return this.free[index];
  }
}

module.exports = { Pool };
