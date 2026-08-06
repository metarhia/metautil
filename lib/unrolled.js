'use strict';

class UnrolledNode {
  constructor(size) {
    this.length = 0;
    this.size = size;
    this.buffer = new Array(size);
    this.reset();
  }

  reset() {
    this.readIndex = 0;
    this.writeIndex = 0;
    this.next = null;
  }

  enqueue(item) {
    if (this.writeIndex >= this.size) return false;
    this.buffer[this.writeIndex++] = item;
    this.length++;
    return true;
  }

  dequeue() {
    let item = undefined;
    if (this.length === 0) return item;
    const index = this.readIndex++;
    item = this.buffer[index];
    this.buffer[index] = undefined;
    this.length--;
    return item;
  }
}

class NodePool {
  constructor(count, factory) {
    const instances = new Array(count);
    for (let i = 0; i < count; i++) instances[i] = factory();
    this.count = count;
    this.instances = instances;
    this.factory = factory;
  }

  acquire() {
    return this.instances.shift() ?? this.factory();
  }

  release(instance) {
    const { instances, count } = this;
    if (instances.length < count) instances.push(instance);
  }
}

class UnrolledList {
  #size = 0;
  #head = null;
  #tail = null;
  #pool = null;

  constructor(options = {}) {
    const { nodeSize = 1024, poolSize = 2 } = options;
    const pool = new NodePool(poolSize, () => new UnrolledNode(nodeSize));
    this.#pool = pool;
    const node = pool.acquire();
    this.#head = node;
    this.#tail = node;
  }

  get size() {
    return this.#size;
  }

  enqueue(item) {
    if (!this.#head.enqueue(item)) {
      const node = this.#pool.acquire();
      this.#head.next = node;
      this.#head = node;
      this.#head.enqueue(item);
    }
    this.#size++;
  }

  dequeue() {
    let item;
    if (this.#size > 0) {
      const tail = this.#tail;
      item = tail.dequeue();
      this.#size--;
      if (tail.length === 0) {
        const next = this.#tail.next;
        if (next !== null) {
          this.#tail = next;
          this.#pool.release(tail);
        }
        tail.reset();
      }
    }
    return item;
  }
}

module.exports = { UnrolledList };
