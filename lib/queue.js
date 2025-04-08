'use strict';

class QueueNode {
  constructor({ size }) {
    this.length = 0;
    this.size = size;
    this.readIndex = 0;
    this.writeIndex = 0;
    this.buffer = new Array(size);
    this.next = null;
  }

  enqueue(item) {
    if (this.length === this.size || this.writeIndex >= this.size) {
      return false;
    }
    this.buffer[this.writeIndex++] = item;
    this.length++;
    return true;
  }

  dequeue() {
    if (this.length === 0) return null;
    const item = this.buffer[this.readIndex++];
    this.length--;
    if (this.length === 0) {
      this.readIndex = 0;
      this.writeIndex = 0;
    }
    return item;
  }
}

class UnrolledQueue {
  #length = 0;
  #nodeSize = 2048;
  #head = null;
  #tail = null;

  constructor(options = {}) {
    const { nodeSize } = options;
    if (nodeSize) this.#nodeSize = nodeSize;
    const node = new QueueNode({ size: this.#nodeSize });
    this.#head = node;
    this.#tail = node;
  }

  get length() {
    return this.#length;
  }

  enqueue(item) {
    if (!this.#head.enqueue(item)) {
      const node = new QueueNode({ size: this.#nodeSize });
      this.#head.next = node;
      this.#head = node;
      this.#head.enqueue(item);
    }
    this.#length++;
  }

  dequeue() {
    const item = this.#tail.dequeue();
    if (item !== null) {
      this.#length--;
      if (this.#tail.length === 0 && this.#tail.next) {
        this.#tail = this.#tail.next;
      }
    }
    return item;
  }
}

module.exports = { UnrolledQueue };
