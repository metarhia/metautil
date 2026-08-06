'use strict';

const { CircularBuffer } = require('./circular.js');

class Stack {
  #buffer = new CircularBuffer();

  get size() {
    return this.#buffer.size;
  }

  static fromArray(values) {
    const stack = new Stack();
    stack.#buffer = CircularBuffer.fromArray(values);
    return stack;
  }

  push(value = undefined) {
    this.#buffer.push(value);
  }

  pop() {
    return this.#buffer.pop();
  }

  peek() {
    return this.#buffer.at(-1);
  }

  isEmpty() {
    return this.#buffer.isEmpty();
  }

  includes(value) {
    return this.#buffer.includes(value);
  }

  every(fn) {
    return this.#buffer.every(fn);
  }

  reduce(fn, acc) {
    return this.#buffer.reduce(fn, acc);
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

module.exports = { Stack };
