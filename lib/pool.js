'use strict';

class Pool {
  constructor() {
    this.items = [];
    this.free = [];
    this.current = 0;
    this.size = 0;
    this.available = 0;
  }

  next() {
    if (this.available === 0) return null;
    let item = null;
    let free = false;
    do {
      item = this.items[this.current];
      free = this.free[this.current];
      this.current++;
    } while (!item && !free);
    if (this.current === this.size) this.current = 0;
    return item;
  }

  add(item) {
    this.size++;
    this.available++;
    this.items.push(item);
    this.free.push(true);
  }

  capture() {
    const item = this.next();
    if (!item) return null;
    const index = this.current - 1;
    this.free[index] = false;
    this.available--;
    return item;
  }

  release(item) {
    const index = this.items.indexOf(item);
    if (index < 0) throw new Error('Pool: release unexpected item');
    this.free[index] = true;
    this.available++;
  }
}

module.exports = { Pool };
