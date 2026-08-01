'use strict';

const INITIAL_CAPACITY = 16;

class CircularBuffer {
  #buffer = new Array(INITIAL_CAPACITY);
  #head = 0;
  #size = 0;

  get size() {
    return this.#size;
  }

  static fromArray(values) {
    const circular = new CircularBuffer();
    const { length } = values;
    let capacity = INITIAL_CAPACITY;
    while (capacity <= length) capacity *= 2;
    const buffer = new Array(capacity);
    for (let i = 0; i < length; i++) buffer[i] = values[i];
    circular.#buffer = buffer;
    circular.#size = length;
    return circular;
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

  unshift(value = undefined) {
    if (this.#size === this.#buffer.length) this.#grow();
    const head = (this.#head - 1) & (this.#buffer.length - 1);
    this.#buffer[head] = value;
    this.#head = head;
    this.#size++;
  }

  push(value = undefined) {
    if (this.#size === this.#buffer.length) this.#grow();
    const tail = (this.#head + this.#size) & (this.#buffer.length - 1);
    this.#buffer[tail] = value;
    this.#size++;
  }

  shift() {
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

  pop() {
    let value;
    if (this.#size > 0) {
      const mask = this.#buffer.length - 1;
      const tail = (this.#head + this.#size - 1) & mask;
      value = this.#buffer[tail];
      this.#buffer[tail] = undefined;
      this.#size--;
    }
    return value;
  }

  at(index) {
    const size = this.#size;
    const i = index < 0 ? size + index : index;
    const inRange = i >= 0 && i < size;
    const mask = this.#buffer.length - 1;
    return inRange ? this.#buffer[(this.#head + i) & mask] : undefined;
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
}

module.exports = { CircularBuffer };
