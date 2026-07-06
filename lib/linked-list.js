'use strict';

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  static fromArray(values) {
    const list = new LinkedList();
    list.appendAll(values);
    return list;
  }

  static fromIterable(iterable) {
    return LinkedList.fromArray(Array.from(iterable));
  }

  append(value = undefined) {
    const node = { value, prev: this.tail, next: null };
    if (this.tail) this.tail.next = node;
    else this.head = node;
    this.tail = node;
    this.size++;
    return node;
  }

  appendAll(values) {
    const { length } = values;
    let node = this.tail;
    for (let i = 0; i < length; i++) {
      const next = { value: values[i], prev: node, next: null };
      if (node) node.next = next;
      else this.head = next;
      node = next;
    }
    this.tail = node;
    this.size += length;
  }

  prepend(value = undefined) {
    const node = { value, prev: null, next: this.head };
    if (this.head) this.head.prev = node;
    else this.tail = node;
    this.head = node;
    this.size++;
    return node;
  }

  at(index) {
    const { size } = this;
    if (index < 0 || index >= size) return null;
    const half = size >> 1;
    if (index <= half) {
      let node = this.head;
      for (let i = 0; i < index; i++) node = node.next;
      return node;
    }
    let node = this.tail;
    for (let i = size - 1; i > index; i--) node = node.prev;
    return node;
  }

  insert(index, value = undefined, count = 1) {
    const node = index < this.size ? this.at(index) : null;
    for (let i = 0; i < count; i++) {
      const prev = node ? node.prev : this.tail;
      const newNode = { value, prev, next: node };
      if (prev) prev.next = newNode;
      else this.head = newNode;
      if (node) node.prev = newNode;
      else this.tail = newNode;
      this.size++;
    }
  }

  delete(index, count = 1) {
    let value = null;
    for (let i = 0; i < count; i++) {
      const node = this.at(index);
      if (!node) break;
      value = this.remove(node);
    }
    return value;
  }

  remove(node) {
    const { prev, next } = node;
    if (prev) prev.next = next;
    else this.head = next;
    if (next) next.prev = prev;
    else this.tail = prev;
    node.prev = null;
    node.next = null;
    this.size--;
    return node.value;
  }

  clear() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  *[Symbol.iterator]() {
    let node = this.head;
    while (node) {
      yield node.value;
      node = node.next;
    }
  }
}

module.exports = { LinkedList };
