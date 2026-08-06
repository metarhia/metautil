'use strict';

const { CircularBuffer } = require('./circular.js');

class Deque {
  #buffer = new CircularBuffer();

  get size() {
    return this.#buffer.size;
  }

  static fromArray(values) {
    const deque = new Deque();
    deque.#buffer = CircularBuffer.fromArray(values);
    return deque;
  }

  unshift(value = undefined) {
    this.#buffer.unshift(value);
  }

  push(value = undefined) {
    this.#buffer.push(value);
  }

  shift() {
    return this.#buffer.shift();
  }

  pop() {
    return this.#buffer.pop();
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

module.exports = { Deque };
