'use strict';

const { Deque } = require('./deque.js');

class Stack {
  #deque = new Deque();

  get size() {
    return this.#deque.size;
  }

  static fromArray(values) {
    const stack = new Stack();
    stack.#deque = Deque.fromArray(values);
    return stack;
  }

  static fromIterable(iterable) {
    return Stack.fromArray(Array.from(iterable));
  }

  push(value = undefined) {
    this.#deque.append(value);
  }

  pop() {
    return this.#deque.pop();
  }

  peek() {
    return this.#deque.last();
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
    const stack = new Stack();
    stack.#deque = this.#deque.clone();
    return stack;
  }

  [Symbol.iterator]() {
    return this.#deque[Symbol.iterator]();
  }

  async *[Symbol.asyncIterator]() {
    for (const value of this.#deque) yield value;
  }
}

module.exports = { Stack };
