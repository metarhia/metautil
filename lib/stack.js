'use strict';

class Stack {
  #items = [];

  get size() {
    return this.#items.length;
  }

  static fromArray(values) {
    const stack = new Stack();
    stack.#items = values.slice();
    return stack;
  }

  static fromIterable(iterable) {
    const stack = new Stack();
    stack.#items = Array.from(iterable);
    return stack;
  }

  push(value = undefined) {
    this.#items.push(value);
  }

  pop() {
    return this.#items.pop();
  }

  peek() {
    return this.#items[this.#items.length - 1];
  }

  first() {
    return this.#items[0];
  }

  last() {
    return this.#items[this.#items.length - 1];
  }

  isEmpty() {
    return this.#items.length === 0;
  }

  includes(value) {
    return this.#items.includes(value);
  }

  clear() {
    this.#items = [];
  }

  toArray() {
    return this.#items.slice();
  }

  clone() {
    return Stack.fromArray(this.#items);
  }

  *[Symbol.iterator]() {
    const len = this.#items.length;
    for (let i = 0; i < len; i++) yield this.#items[i];
  }

  async *[Symbol.asyncIterator]() {
    const len = this.#items.length;
    for (let i = 0; i < len; i++) yield this.#items[i];
  }
}

module.exports = { Stack };
