'use strict';

const { LinkedList } = require('./linked-list.js');

class Queue {
  #list = null;

  constructor() {
    this.#list = new LinkedList();
  }

  get size() {
    return this.#list.size;
  }

  static fromArray(values) {
    const queue = new Queue();
    queue.#list.appendAll(values);
    return queue;
  }

  static fromIterable(iterable) {
    return Queue.fromArray(Array.from(iterable));
  }

  enqueue(value = undefined) {
    this.#list.append(value);
  }

  dequeue() {
    return this.#list.size > 0 ? this.#list.delete(0) : undefined;
  }

  peek() {
    return this.#list.head ? this.#list.head.value : undefined;
  }

  first() {
    return this.#list.head ? this.#list.head.value : undefined;
  }

  last() {
    return this.#list.tail ? this.#list.tail.value : undefined;
  }

  isEmpty() {
    return this.#list.size === 0;
  }

  includes(value) {
    for (const item of this.#list) {
      if (item === value) return true;
    }
    return false;
  }

  clear() {
    this.#list.clear();
  }

  toArray() {
    return Array.from(this.#list);
  }

  clone() {
    return Queue.fromIterable(this.#list);
  }

  *[Symbol.iterator]() {
    yield* this.#list;
  }

  async *[Symbol.asyncIterator]() {
    for (const value of this.#list) yield value;
  }
}

module.exports = { Queue };
