'use strict';

const { Deque } = require('./deque.js');

class Queue {
  #deque = new Deque();

  get size() {
    return this.#deque.size;
  }

  static fromArray(values) {
    const queue = new Queue();
    queue.#deque = Deque.fromArray(values);
    return queue;
  }

  static fromIterable(iterable) {
    return Queue.fromArray(Array.from(iterable));
  }

  enqueue(value = undefined) {
    this.#deque.append(value);
  }

  dequeue() {
    return this.#deque.dequeue();
  }

  peek() {
    return this.#deque.first();
  }

  first() {
    return this.#deque.first();
  }

  last() {
    return this.#deque.last();
  }

  isEmpty() {
    return this.#deque.isEmpty();
  }

  includes(value) {
    return this.#deque.includes(value);
  }

  clear() {
    this.#deque.clear();
  }

  toArray() {
    return this.#deque.toArray();
  }

  clone() {
    const queue = new Queue();
    queue.#deque = this.#deque.clone();
    return queue;
  }

  [Symbol.iterator]() {
    return this.#deque[Symbol.iterator]();
  }

  [Symbol.asyncIterator]() {
    return this.#deque[Symbol.asyncIterator]();
  }
}

module.exports = { Queue };
