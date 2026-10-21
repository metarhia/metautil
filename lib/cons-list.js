'use strict';

class ConsList {
  #value = undefined;
  #next = null;
  #size = 0;

  static #EMPTY = new ConsList();

  constructor(value = undefined, next = null, size = 0) {
    this.#value = value;
    this.#next = next;
    this.#size = size;
  }

  static get empty() {
    return ConsList.#EMPTY;
  }

  static of(...values) {
    return ConsList.fromArray(values);
  }

  static fromArray(values) {
    return ConsList.#prependAll(values, ConsList.empty);
  }

  static #prependAll(values, list) {
    let result = list;
    for (let i = values.length - 1; i >= 0; i--) {
      result = result.prepend(values[i]);
    }
    return result;
  }

  static fromIterable(iterable) {
    const values = Array.from(iterable);
    return ConsList.fromArray(values);
  }

  static merge(...lists) {
    const count = lists.length;
    if (count === 0) return ConsList.empty;
    let result = lists[count - 1];
    for (let i = count - 2; i >= 0; i--) {
      const list = lists[i];
      if (list.isEmpty()) continue;
      if (result.isEmpty()) {
        result = list;
        continue;
      }
      const values = list.toArray();
      result = ConsList.#prependAll(values, result);
    }
    return result;
  }

  get value() {
    return this.#value;
  }

  get tail() {
    if (this.#next === null) return ConsList.empty;
    return this.#next;
  }

  get size() {
    return this.#size;
  }

  isEmpty() {
    return this.#size === 0;
  }

  prepend(value = undefined) {
    const next = this.isEmpty() ? null : this;
    return new ConsList(value, next, this.#size + 1);
  }

  uncons() {
    return { value: this.#value, tail: this.tail };
  }

  equals(other) {
    if (this === other) return true;
    if (!(other instanceof ConsList)) return false;
    const size = this.#size;
    if (size !== other.#size) return false;
    let current = this;
    let compared = other;
    for (let i = 0; i < size; i++) {
      if (current.#value !== compared.#value) return false;
      current = current.#next;
      compared = compared.#next;
    }
    return true;
  }

  includes(value) {
    let current = this;
    for (let i = 0; i < this.#size; i++) {
      if (current.#value === value) return true;
      current = current.#next;
    }
    return false;
  }

  member(value) {
    let current = this;
    for (let i = 0; i < this.#size; i++) {
      if (current.#value === value) return current;
      current = current.#next;
    }
    return ConsList.empty;
  }

  toReversed() {
    let result = ConsList.empty;
    let current = this;
    for (let i = 0; i < this.#size; i++) {
      result = result.prepend(current.#value);
      current = current.#next;
    }
    return result;
  }

  map(fn) {
    const size = this.#size;
    const values = new Array(size);
    let current = this;
    for (let i = 0; i < size; i++) {
      values[i] = fn(current.#value, i);
      current = current.#next;
    }
    return ConsList.fromArray(values);
  }

  filter(fn) {
    const values = [];
    let current = this;
    for (let i = 0; i < this.#size; i++) {
      const value = current.#value;
      if (fn(value, i)) values.push(value);
      current = current.#next;
    }
    return ConsList.fromArray(values);
  }

  find(fn) {
    const result = undefined;
    let current = this;
    for (let i = 0; i < this.#size; i++) {
      const value = current.#value;
      if (fn(value, i)) return value;
      current = current.#next;
    }
    return result;
  }

  some(fn) {
    let current = this;
    for (let i = 0; i < this.#size; i++) {
      if (fn(current.#value, i)) return true;
      current = current.#next;
    }
    return false;
  }

  every(fn) {
    let current = this;
    for (let i = 0; i < this.#size; i++) {
      if (!fn(current.#value, i)) return false;
      current = current.#next;
    }
    return true;
  }

  reduce(fn, acc) {
    const size = this.#size;
    let current = this;
    let index = 0;
    let result = acc;
    if (acc === undefined) {
      if (size === 0) throw new TypeError('ConsList is empty');
      result = current.#value;
      current = current.#next;
      index = 1;
    }
    for (; index < size; index++) {
      result = fn(result, current.#value, index);
      current = current.#next;
    }
    return result;
  }

  toArray() {
    const size = this.#size;
    const result = new Array(size);
    let current = this;
    for (let i = 0; i < size; i++) {
      result[i] = current.#value;
      current = current.#next;
    }
    return result;
  }

  [Symbol.iterator]() {
    let current = this;
    let remaining = this.#size;
    return {
      next: () => {
        if (remaining === 0) return { done: true, value: undefined };
        const value = current.#value;
        current = current.#next;
        remaining--;
        return { done: false, value };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }
}

const cons = (value, tail = ConsList.empty) => tail.prepend(value);
const uncons = (list) => list.uncons();

module.exports = { ConsList, cons, uncons };
