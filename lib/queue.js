'use strict';

const { CircularBuffer } = require('./circular.js');

class Queue {
  #buffer = new CircularBuffer();

  get size() {
    return this.#buffer.size;
  }

  static fromArray(values) {
    const queue = new Queue();
    queue.#buffer = CircularBuffer.fromArray(values);
    return queue;
  }

  enqueue(value = undefined) {
    this.#buffer.push(value);
  }

  dequeue() {
    return this.#buffer.shift();
  }

  peek() {
    return this.#buffer.at(0);
  }

  isEmpty() {
    return this.#buffer.isEmpty();
  }

  includes(value) {
    return this.#buffer.includes(value);
  }

  clear() {
    this.#buffer.clear();
  }

  toArray() {
    return this.#buffer.toArray();
  }

  [Symbol.iterator]() {
    return this.#buffer[Symbol.iterator]();
  }
}

module.exports = { Queue };
