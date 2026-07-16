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

  get next() {
    return this.#next;
  }

  get size() {
    return this.#size;
  }

  isEmpty() {
    return this.#size === 0;
  }

  first() {
    return this.#value;
  }

  rest() {
    if (this.#next === null) return ConsList.empty;
    return this.#next;
  }

  prepend(value = undefined) {
    const next = this.isEmpty() ? null : this;
    return new ConsList(value, next, this.#size + 1);
  }

  toArray() {
    const result = [];
    let current = this;
    while (current && !current.isEmpty()) {
      result.push(current.value);
      current = current.next;
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
        const value = current.value;
        current = current.next;
        return { done: false, value };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }
}

module.exports = { ConsList };
