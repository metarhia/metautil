'use strict';

const { LinkedList } = require('./linked-list.js');
const { shuffle: shuffleArray } = require('./array.js');

class List {
  #list = null;

  constructor() {
    this.#list = new LinkedList();
  }

  get size() {
    return this.#list.size;
  }

  static fromArray(values) {
    const list = new List();
    list.#list.appendAll(values);
    return list;
  }

  static fromIterable(iterable) {
    return List.fromArray(Array.from(iterable));
  }

  static range(start, end, step = 1) {
    const list = new List();
    if (step > 0) {
      for (let i = start; i <= end; i += step) list.#list.append(i);
    } else if (step < 0) {
      for (let i = start; i >= end; i += step) list.#list.append(i);
    }
    return list;
  }

  static merge(lists) {
    const result = new List();
    for (const list of lists) {
      let node = list.#list.head;
      while (node) {
        result.#list.append(node.value);
        node = node.next;
      }
    }
    return result;
  }

  append(value = undefined) {
    this.#list.append(value);
  }

  prepend(value = undefined) {
    this.#list.prepend(value);
  }

  enqueue(value = undefined) {
    this.#list.append(value);
  }

  dequeue() {
    return this.#list.size > 0 ? this.#list.delete(0) : undefined;
  }

  insert(index, value = undefined, count = 1) {
    this.#list.insert(index, value, count);
  }

  delete(index, count = 1) {
    this.#list.delete(index, count);
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

  tail(n = 1) {
    return this.slice(n);
  }

  init(n = 1) {
    return this.slice(0, this.#list.size - n);
  }

  drop(n) {
    if (n === 0) return;
    const count = n > 0 ? n : -n;
    for (let i = 0; i < count && this.#list.size > 0; i++) {
      if (n > 0) this.#list.delete(0);
      else this.#list.delete(this.#list.size - 1);
    }
  }

  take(n) {
    const result = new List();
    if (n === 0) return result;
    const { size } = this.#list;
    const start = n > 0 ? 0 : Math.max(0, size + n);
    const end = n > 0 ? Math.min(n, size) : size;
    let node = this.#list.at(start);
    for (let i = start; i < end && node; i++) {
      result.#list.append(node.value);
      node = node.next;
    }
    return result;
  }

  slice(start = 0, end) {
    const size = this.#list.size;
    const e = end === undefined ? size : end;
    const from = start < 0 ? Math.max(0, size + start) : Math.min(start, size);
    const to = e < 0 ? Math.max(0, size + e) : Math.min(e, size);
    const result = new List();
    if (from >= to) return result;
    let node = this.#list.at(from);
    for (let i = from; i < to && node; i++) {
      result.#list.append(node.value);
      node = node.next;
    }
    return result;
  }

  rotateLeft(steps = 1) {
    this.#list.rotate(steps);
  }

  rotateRight(steps = 1) {
    this.#list.rotate(-steps);
  }

  rotate(n) {
    if (n >= 0) this.rotateLeft(n);
    else this.rotateRight(-n);
  }

  swap(i, j) {
    const nodeI = this.#list.at(i);
    const nodeJ = this.#list.at(j);
    if (!nodeI || !nodeJ) return;
    const tmp = nodeI.value;
    nodeI.value = nodeJ.value;
    nodeJ.value = tmp;
  }

  move(from, to) {
    const { size } = this.#list;
    if (from === to || from < 0 || from >= size || to < 0 || to >= size) {
      return;
    }
    const node = this.#list.at(from);
    const value = this.#list.remove(node);
    this.#list.insert(to, value);
  }

  splitAt(index) {
    const before = new List();
    const after = new List();
    let node = this.#list.head;
    let i = 0;
    while (node) {
      if (i < index) before.#list.append(node.value);
      else after.#list.append(node.value);
      node = node.next;
      i++;
    }
    return { before, after };
  }

  groupBy(key) {
    const map = new Map();
    let node = this.#list.head;
    while (node) {
      const k = key(node.value);
      let group = map.get(k);
      if (!group) {
        group = new List();
        map.set(k, group);
      }
      group.#list.append(node.value);
      node = node.next;
    }
    return map;
  }

  includes(value) {
    let node = this.#list.head;
    while (node) {
      if (node.value === value) return true;
      node = node.next;
    }
    return false;
  }

  indexOf(value) {
    let node = this.#list.head;
    let index = 0;
    while (node) {
      if (node.value === value) return index;
      node = node.next;
      index++;
    }
    return -1;
  }

  lastIndexOf(value) {
    let node = this.#list.tail;
    let index = this.#list.size - 1;
    while (node) {
      if (node.value === value) return index;
      node = node.prev;
      index--;
    }
    return -1;
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

  addAll(values) {
    const items = Array.isArray(values) ? values : Array.from(values);
    this.#list.appendAll(items);
  }

  removeAll(values) {
    const toRemove = new Set(values);
    let node = this.#list.head;
    while (node) {
      const next = node.next;
      if (toRemove.has(node.value)) this.#list.remove(node);
      node = next;
    }
  }

  fill(value = undefined, start = 0, end) {
    const size = this.#list.size;
    const e = end === undefined ? size : Math.min(end, size);
    let i = 0;
    let node = this.#list.head;
    while (node) {
      if (i >= e) break;
      if (i >= start) node.value = value;
      node = node.next;
      i++;
    }
  }

  replace(oldValue, newValue = undefined) {
    let node = this.#list.head;
    while (node) {
      if (node.value === oldValue) node.value = newValue;
      node = node.next;
    }
  }

  distinct() {
    const seen = new Set();
    let node = this.#list.head;
    while (node) {
      const next = node.next;
      if (seen.has(node.value)) this.#list.remove(node);
      else seen.add(node.value);
      node = next;
    }
  }

  toDistinct() {
    const result = new List();
    const seen = new Set();
    let node = this.#list.head;
    while (node) {
      const { value } = node;
      if (!seen.has(value)) {
        seen.add(value);
        result.#list.append(value);
      }
      node = node.next;
    }
    return result;
  }

  reverse() {
    const arr = this.toArray();
    arr.reverse();
    let node = this.#list.head;
    for (const value of arr) {
      node.value = value;
      node = node.next;
    }
  }

  toReversed() {
    return List.fromArray(this.toArray().reverse());
  }

  sort(compare) {
    const arr = this.toArray();
    arr.sort(compare);
    let node = this.#list.head;
    for (const value of arr) {
      node.value = value;
      node = node.next;
    }
  }

  toSorted(compare) {
    const arr = this.toArray();
    arr.sort(compare);
    return List.fromArray(arr);
  }

  shuffle() {
    const arr = this.toArray();
    shuffleArray(arr);
    let node = this.#list.head;
    for (const value of arr) {
      node.value = value;
      node = node.next;
    }
  }

  toShuffled() {
    const arr = this.toArray();
    shuffleArray(arr);
    return List.fromArray(arr);
  }

  map(fn) {
    const result = new List();
    let node = this.#list.head;
    let index = 0;
    while (node) {
      result.#list.append(fn(node.value, index));
      node = node.next;
      index++;
    }
    return result;
  }

  *lazyMap(fn) {
    let index = 0;
    for (const value of this.#list) {
      yield fn(value, index);
      index++;
    }
  }

  flatMap(fn) {
    const result = new List();
    let node = this.#list.head;
    while (node) {
      for (const item of fn(node.value)) result.#list.append(item);
      node = node.next;
    }
    return result;
  }

  filter(fn) {
    const result = new List();
    let node = this.#list.head;
    let index = 0;
    while (node) {
      if (fn(node.value, index)) result.#list.append(node.value);
      node = node.next;
      index++;
    }
    return result;
  }

  *lazyFilter(fn) {
    let index = 0;
    for (const value of this.#list) {
      if (fn(value, index)) yield value;
      index++;
    }
  }

  reduce(fn, initial) {
    let acc = initial;
    let node = this.#list.head;
    let index = 0;
    while (node) {
      acc = fn(acc, node.value, index);
      node = node.next;
      index++;
    }
    return acc;
  }

  *lazyReduce(fn, initial) {
    let acc = initial;
    let index = 0;
    for (const value of this.#list) {
      acc = fn(acc, value, index);
      yield acc;
      index++;
    }
  }

  some(fn) {
    let node = this.#list.head;
    let index = 0;
    while (node) {
      if (fn(node.value, index)) return true;
      node = node.next;
      index++;
    }
    return false;
  }

  every(fn) {
    let node = this.#list.head;
    let index = 0;
    while (node) {
      if (!fn(node.value, index)) return false;
      node = node.next;
      index++;
    }
    return true;
  }

  find(fn) {
    let result;
    let node = this.#list.head;
    let index = 0;
    while (node) {
      if (fn(node.value, index)) {
        result = node.value;
        break;
      }
      node = node.next;
      index++;
    }
    return result;
  }

  findIndex(fn) {
    let node = this.#list.head;
    let index = 0;
    while (node) {
      if (fn(node.value, index)) return index;
      node = node.next;
      index++;
    }
    return -1;
  }

  sum(fn) {
    let total = 0;
    let node = this.#list.head;
    while (node) {
      total += fn ? fn(node.value) : node.value;
      node = node.next;
    }
    return total;
  }

  avg(fn) {
    const { size } = this.#list;
    return size === 0 ? 0 : this.sum(fn) / size;
  }

  min(compare) {
    let result;
    let hasValue = false;
    let node = this.#list.head;
    while (node) {
      const { value } = node;
      const less =
        !hasValue || (compare ? compare(value, result) < 0 : value < result);
      if (less) {
        result = value;
        hasValue = true;
      }
      node = node.next;
    }
    return result;
  }

  max(compare) {
    let result;
    let hasValue = false;
    let node = this.#list.head;
    while (node) {
      const { value } = node;
      const more =
        !hasValue || (compare ? compare(value, result) > 0 : value > result);
      if (more) {
        result = value;
        hasValue = true;
      }
      node = node.next;
    }
    return result;
  }

  isEmpty() {
    return this.#list.size === 0;
  }

  clear() {
    this.#list.clear();
  }

  toArray() {
    return Array.from(this.#list);
  }

  join(separator = ',') {
    return this.toArray().join(separator);
  }

  clone() {
    const list = new List();
    let node = this.#list.head;
    while (node) {
      list.#list.append(node.value);
      node = node.next;
    }
    return list;
  }

  [Symbol.iterator]() {
    return this.#list[Symbol.iterator]();
  }

  async *[Symbol.asyncIterator]() {
    let node = this.#list.head;
    while (node) {
      yield node.value;
      node = node.next;
    }
  }
}

module.exports = { List };
