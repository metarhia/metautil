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
    let list = ConsList.empty;
    for (let i = values.length - 1; i >= 0; i--) {
      list = list.prepend(values[i]);
    }
    return list;
  }

  static fromIterable(iterable) {
    return ConsList.fromArray(Array.from(iterable));
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
      const size = list.#size;
      const values = new Array(size);
      let current = list;
      for (let j = 0; j < size; j++) {
        values[j] = current.#value;
        current = current.#next;
      }
      for (let j = size - 1; j >= 0; j--) {
        result = result.prepend(values[j]);
      }
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
    const tail = this.#next === null ? ConsList.empty : this.#next;
    return { value: this.#value, tail };
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

  reverse() {
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
    if (size === 0) return ConsList.empty;
    const values = new Array(size);
    let current = this;
    for (let i = 0; i < size; i++) {
      values[i] = fn(current.#value, i);
      current = current.#next;
    }
    return ConsList.fromArray(values);
  }

  reduce(fn, acc = undefined) {
    const size = this.#size;
    let current = this;
    let index = 0;
    let result = acc;
    if (acc === undefined) {
      if (this.isEmpty()) throw new TypeError('ConsList is empty');
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
    const result = new Array(this.#size);
    let current = this;
    let index = 0;
    while (current && !current.isEmpty()) {
      result[index++] = current.#value;
      current = current.#next;
    }
    return result;
  }

  [Symbol.iterator]() {
    let current = this;
    return {
      next: () => {
        if (!current || current.isEmpty()) {
          return { done: true, value: undefined };
        }
        const value = current.#value;
        current = current.#next;
        return { done: false, value };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }
}

const cons = (value, tail = ConsList.empty) => tail.prepend(value);

module.exports = { ConsList, cons };
