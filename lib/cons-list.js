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
