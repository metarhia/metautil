'use strict';

const INITIAL_CAPACITY = 16;

const capacityFor = (n) => {
  let capacity = INITIAL_CAPACITY;
  while (capacity <= n) capacity *= 2;
  return capacity;
};

class Queue {
  #buffer = new Array(INITIAL_CAPACITY);
  #head = 0;
  #size = 0;

  get size() {
    return this.#size;
  }

  static fromArray(values) {
    const queue = new Queue();
    const { length } = values;
    const buffer = new Array(capacityFor(length));
    for (let i = 0; i < length; i++) buffer[i] = values[i];
    queue.#buffer = buffer;
    queue.#size = length;
    return queue;
  }

  static fromIterable(iterable) {
    return Queue.fromArray(Array.from(iterable));
  }

  #grow() {
    const buffer = this.#buffer;
    const capacity = buffer.length;
    const mask = capacity - 1;
    const head = this.#head;
    const next = new Array(capacity * 2);
    for (let i = 0; i < this.#size; i++) {
      next[i] = buffer[(head + i) & mask];
    }
    this.#buffer = next;
    this.#head = 0;
  }

  enqueue(value = undefined) {
    if (this.#size === this.#buffer.length) this.#grow();
    const tail = (this.#head + this.#size) & (this.#buffer.length - 1);
    this.#buffer[tail] = value;
    this.#size++;
  }

  dequeue() {
    let value;
    if (this.#size > 0) {
      const head = this.#head;
      value = this.#buffer[head];
      this.#buffer[head] = undefined;
      this.#head = (head + 1) & (this.#buffer.length - 1);
      this.#size--;
    }
    return value;
  }

  peek() {
    return this.#buffer[this.#head];
  }

  first() {
    return this.#buffer[this.#head];
  }

  last() {
    const mask = this.#buffer.length - 1;
    const tail = (this.#head + this.#size - 1) & mask;
    return this.#size > 0 ? this.#buffer[tail] : undefined;
  }

  isEmpty() {
    return this.#size === 0;
  }

  includes(value) {
    const buffer = this.#buffer;
    const mask = buffer.length - 1;
    const head = this.#head;
    for (let i = 0; i < this.#size; i++) {
      if (buffer[(head + i) & mask] === value) return true;
    }
    return false;
  }

  clear() {
    this.#buffer = new Array(INITIAL_CAPACITY);
    this.#head = 0;
    this.#size = 0;
  }

  toArray() {
    const buffer = this.#buffer;
    const mask = buffer.length - 1;
    const head = this.#head;
    const size = this.#size;
    const result = new Array(size);
    for (let i = 0; i < size; i++) {
      result[i] = buffer[(head + i) & mask];
    }
    return result;
  }

  clone() {
    const queue = new Queue();
    queue.#buffer = this.#buffer.slice();
    queue.#head = this.#head;
    queue.#size = this.#size;
    return queue;
  }

  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index >= this.#size) return { done: true, value: undefined };
        const mask = this.#buffer.length - 1;
        const value = this.#buffer[(this.#head + index) & mask];
        index++;
        return { done: false, value };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }

  async *[Symbol.asyncIterator]() {
    for (const value of this) yield value;
  }
}

module.exports = { Queue };
