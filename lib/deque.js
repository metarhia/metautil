'use strict';

const INITIAL_CAPACITY = 16;

const capacityFor = (n) => {
  let capacity = INITIAL_CAPACITY;
  while (capacity <= n) capacity *= 2;
  return capacity;
};

class Deque {
  #buffer = new Array(INITIAL_CAPACITY);
  #head = 0;
  #size = 0;

  get size() {
    return this.#size;
  }

  static fromArray(values) {
    const deque = new Deque();
    const { length } = values;
    const buffer = new Array(capacityFor(length));
    for (let i = 0; i < length; i++) buffer[i] = values[i];
    deque.#buffer = buffer;
    deque.#size = length;
    return deque;
  }

  static fromIterable(iterable) {
    return Deque.fromArray(Array.from(iterable));
  }

  static range(start, end, step = 1) {
    const deque = new Deque();
    if (step > 0) {
      for (let i = start; i <= end; i += step) deque.append(i);
    } else if (step < 0) {
      for (let i = start; i >= end; i += step) deque.append(i);
    }
    return deque;
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

  prepend(value = undefined) {
    if (this.#size === this.#buffer.length) this.#grow();
    const head = (this.#head - 1) & (this.#buffer.length - 1);
    this.#buffer[head] = value;
    this.#head = head;
    this.#size++;
  }

  append(value = undefined) {
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
    const inRange = index >= 0 && index < this.#size;
    const mask = this.#buffer.length - 1;
    return inRange ? this.#buffer[(this.#head + index) & mask] : undefined;
  }

  set(index, value = undefined) {
    if (index < 0 || index >= this.#size) return;
    const mask = this.#buffer.length - 1;
    this.#buffer[(this.#head + index) & mask] = value;
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

  equals(other) {
    const size = this.#size;
    if (size !== other.#size) return false;
    for (let i = 0; i < size; i++) {
      if (this.at(i) !== other.at(i)) return false;
    }
    return true;
  }

  rotateLeft(steps = 1) {
    const size = this.#size;
    if (size === 0) return;
    const n = ((steps % size) + size) % size;
    if (n === 0) return;
    if (n <= size - n) {
      for (let i = 0; i < n; i++) this.append(this.dequeue());
    } else {
      for (let i = 0; i < size - n; i++) this.prepend(this.pop());
    }
  }

  rotateRight(steps = 1) {
    this.rotateLeft(-steps);
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
    const deque = new Deque();
    deque.#buffer = this.#buffer.slice();
    deque.#head = this.#head;
    deque.#size = this.#size;
    return deque;
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

  [Symbol.asyncIterator]() {
    let index = 0;
    return {
      next: () => {
        if (index >= this.#size) {
          return Promise.resolve({ done: true, value: undefined });
        }
        const mask = this.#buffer.length - 1;
        const value = this.#buffer[(this.#head + index) & mask];
        index++;
        return Promise.resolve({ done: false, value });
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  }
}

module.exports = { Deque };
