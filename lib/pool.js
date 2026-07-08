'use strict';

class Lease {
  #resource = null;
  #release = null;
  #released = false;

  constructor(resource, release) {
    this.#resource = resource;
    this.#release = release;
  }

  get resource() {
    return this.#resource;
  }

  release() {
    if (this.#released) {
      throw new Error('Pool: release already released');
    }
    this.#released = true;
    this.#release();
  }
}

class Pool {
  #items = [];
  #free = [];
  #queue = [];
  #leases = new WeakSet();
  #timeout = 0;
  #current = 0;
  #size = 0;
  #available = 0;

  constructor(options = {}) {
    if (typeof options.timeout === 'number') {
      this.#timeout = options.timeout;
    }
  }

  next() {
    if (this.#size === 0) return null;
    let attempts = 0;
    do {
      const index = this.#current;
      const resource = this.#items[index];
      const free = this.#free[index];
      this.#current++;
      if (this.#current === this.#size) this.#current = 0;
      if (resource && free) return resource;
      attempts++;
    } while (attempts < this.#size);
    return null;
  }

  capture() {
    return this.#nextLease(true);
  }

  release(lease) {
    if (!(lease instanceof Lease) || !this.#leases.has(lease)) {
      throw new Error('Pool: release unexpected lease');
    }
    lease.release();
  }

  isFree(resource) {
    for (let i = 0; i < this.#size; i++) {
      if (this.#items[i] === resource) return this.#free[i];
    }
    return false;
  }

  add(resource) {
    for (let i = 0; i < this.#size; i++) {
      if (this.#items[i] === resource) {
        throw new Error('Pool: add duplicates');
      }
    }
    this.#items.push(resource);
    this.#free.push(true);
    this.#size++;
    this.#available++;
  }

  #nextLease(exclusive) {
    if (this.#size === 0) return null;
    if (exclusive && this.#available === 0) {
      return new Promise((resolve, reject) => {
        const waiting = { resolve, reject, timer: null };
        if (this.#timeout > 0) {
          waiting.timer = setTimeout(() => {
            waiting.resolve = null;
            this.#removeWaiting(waiting);
            reject(new Error('Pool next item timeout'));
          }, this.#timeout);
        }
        this.#queue.push(waiting);
      });
    }
    return this.#takeLease();
  }

  #takeLease() {
    let attempts = 0;
    do {
      const index = this.#current;
      const resource = this.#items[index];
      const free = this.#free[index];
      this.#current++;
      if (this.#current === this.#size) this.#current = 0;
      if (resource && free) {
        this.#free[index] = false;
        this.#available--;
        return this.#createLease(resource, index);
      }
      attempts++;
    } while (attempts < this.#size);
    return null;
  }

  #createLease(resource, index) {
    const lease = new Lease(resource, () => {
      this.#releaseResource(resource, index);
    });
    this.#leases.add(lease);
    return lease;
  }

  #releaseResource(resource, index) {
    if (this.#items[index] !== resource) {
      throw new Error('Pool: release unexpected item');
    }
    if (this.#free[index]) {
      throw new Error('Pool: release not captured');
    }
    const waiting = this.#queue.shift();
    if (waiting) {
      if (waiting.timer) clearTimeout(waiting.timer);
      if (waiting.resolve) {
        waiting.resolve(this.#createLease(resource, index));
        return;
      }
    }
    this.#free[index] = true;
    this.#available++;
  }

  #removeWaiting(waiting) {
    const index = this.#queue.indexOf(waiting);
    if (index !== -1) this.#queue.splice(index, 1);
  }
}

module.exports = { Pool, Lease };
