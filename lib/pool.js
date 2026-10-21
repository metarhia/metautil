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
  #available = 0;

  constructor(options = {}) {
    if (typeof options.timeout === 'number') {
      this.#timeout = options.timeout;
    }
  }

  next() {
    const index = this.#nextFreeIndex();
    return index === -1 ? null : this.#items[index];
  }

  capture() {
    if (this.#items.length === 0) return null;
    if (this.#available === 0) {
      return new Promise((resolve, reject) => {
        const waiting = { resolve, timer: null };
        if (this.#timeout > 0) {
          waiting.timer = setTimeout(() => {
            const position = this.#queue.indexOf(waiting);
            this.#queue.splice(position, 1);
            reject(new Error('Pool next item timeout'));
          }, this.#timeout);
        }
        this.#queue.push(waiting);
      });
    }
    return this.#takeLease();
  }

  release(lease) {
    if (!(lease instanceof Lease) || !this.#leases.has(lease)) {
      throw new Error('Pool: release unexpected lease');
    }
    lease.release();
  }

  isFree(resource) {
    const index = this.#items.indexOf(resource);
    return index === -1 ? false : this.#free[index];
  }

  add(resource) {
    if (this.#items.indexOf(resource) !== -1) {
      throw new Error('Pool: add duplicates');
    }
    this.#items.push(resource);
    this.#free.push(true);
    this.#available++;
  }

  #nextFreeIndex() {
    if (this.#available === 0) return -1;
    const size = this.#items.length;
    for (let attempts = 0; attempts < size; attempts++) {
      const index = this.#current;
      this.#current = index + 1 === size ? 0 : index + 1;
      if (this.#free[index]) return index;
    }
    return -1;
  }

  #takeLease() {
    const index = this.#nextFreeIndex();
    if (index === -1) return null;
    this.#free[index] = false;
    this.#available--;
    return this.#createLease(this.#items[index], index);
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
    if (waiting !== undefined) {
      clearTimeout(waiting.timer);
      const lease = this.#createLease(resource, index);
      waiting.resolve(lease);
      return;
    }
    this.#free[index] = true;
    this.#available++;
  }
}

module.exports = { Pool, Lease };
