'use strict';

const { LinkedList } = require('./linked-list.js');

class Deque {
  #list = null;

  constructor() {
    this.#list = new LinkedList();
  }

  get size() {
    return this.#list.size;
  }

  static fromArray(values) {
    const deque = new Deque();
    deque.#list.appendAll(values);
    return deque;
  }

  static fromIterable(iterable) {
    return Deque.fromArray(Array.from(iterable));
  }

  static range(start, end, step = 1) {
    const deque = new Deque();
    if (step > 0) {
      for (let i = start; i <= end; i += step) deque.#list.append(i);
    } else if (step < 0) {
      for (let i = start; i >= end; i += step) deque.#list.append(i);
    }
    return deque;
  }

  prepend(value = undefined) {
    this.#list.prepend(value);
  }

  append(value = undefined) {
    this.#list.append(value);
  }

  dequeue() {
    return this.#list.size > 0 ? this.#list.delete(0) : undefined;
  }

  pop() {
    return this.#list.size > 0
      ? this.#list.delete(this.#list.size - 1)
      : undefined;
  }

  at(index) {
    const node = this.#list.at(index);
    return node ? node.value : undefined;
  }

  set(index, value = undefined) {
    const node = this.#list.at(index);
    if (node) node.value = value;
  }

  first() {
    return this.#list.head ? this.#list.head.value : undefined;
  }

  last() {
    return this.#list.tail ? this.#list.tail.value : undefined;
  }

  isEmpty() {
    return this.#list.size === 0;
  }

  includes(value) {
    for (const item of this.#list) {
      if (item === value) return true;
    }
    return false;
  }

  equals(other) {
    if (this.#list.size !== other.size) return false;
    let nodeA = this.#list.head;
    let nodeB = other.#list.head;
    while (nodeA) {
      if (nodeA.value !== nodeB.value) return false;
      nodeA = nodeA.next;
      nodeB = nodeB.next;
    }
    return true;
  }

  rotateLeft(steps = 1) {
    const { size } = this.#list;
    if (size === 0) return;
    const n = ((steps % size) + size) % size;
    for (let i = 0; i < n; i++) this.#list.append(this.#list.delete(0));
  }

  rotateRight(steps = 1) {
    const { size } = this.#list;
    if (size === 0) return;
    const n = ((steps % size) + size) % size;
    for (let i = 0; i < n; i++) {
      this.#list.prepend(this.#list.delete(this.#list.size - 1));
    }
  }

  clear() {
    this.#list.clear();
  }

  toArray() {
    return Array.from(this.#list);
  }

  clone() {
    return Deque.fromIterable(this.#list);
  }

  *[Symbol.iterator]() {
    yield* this.#list;
  }

  async *[Symbol.asyncIterator]() {
    for (const value of this.#list) yield value;
  }
}

module.exports = { Deque };
