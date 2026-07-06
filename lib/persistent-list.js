'use strict';

class PersistentList {
  #value = undefined;
  #next = null;
  #size = 0;

  static #EMPTY = new PersistentList();

  constructor(value = undefined, next = null, size = 0) {
    this.#value = value;
    this.#next = next;
    this.#size = size;
  }

  static get empty() {
    return PersistentList.#EMPTY;
  }

  static of(...values) {
    return PersistentList.fromArray(values);
  }

  static fromArray(values) {
    let list = PersistentList.empty;
    for (let i = values.length - 1; i >= 0; i--) {
      list = list.prepend(values[i]);
    }
    return list;
  }

  static fromIterable(iterable) {
    return PersistentList.fromArray(Array.from(iterable));
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
    if (this.#next === null) return PersistentList.empty;
    return this.#next;
  }

  prepend(value = undefined) {
    const next = this.isEmpty() ? null : this;
    return new PersistentList(value, next, this.#size + 1);
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

  *[Symbol.iterator]() {
    let current = this;
    while (current && !current.isEmpty()) {
      yield current.value;
      current = current.next;
    }
  }
}

module.exports = { PersistentList };
