'use strict';

const compareAsc = (a, b) => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

const isCount = (n) => Number.isInteger(n) && n > 0;

const sameValueZero = (left, right) =>
  left === right || (Number.isNaN(left) && Number.isNaN(right));

class ListNode {
  static fromArray(values) {
    const { length } = values;
    if (length === 0) return { head: null, tail: null, size: 0 };
    const head = new ListNode(values[0]);
    let tail = head;
    for (let i = 1; i < length; i++) {
      tail = ListNode.create(values[i], tail);
    }
    return { head, tail, size: length };
  }

  static copy(node, count) {
    if (!isCount(count)) {
      return { head: null, tail: null, next: node, size: 0 };
    }
    const head = new ListNode(node.value);
    let tail = head;
    let current = node.next;
    for (let i = 1; i < count; i++) {
      tail = ListNode.create(current.value, tail);
      current = current.next;
    }
    return { head, tail, next: current, size: count };
  }

  static link(left, right) {
    if (left !== null) left.next = right;
    if (right !== null) right.prev = left;
  }

  static create(value, prev = null, next = null) {
    const node = new ListNode(value);
    node.prev = prev;
    node.next = next;
    if (prev !== null) prev.next = node;
    if (next !== null) next.prev = node;
    return node;
  }

  constructor(value = undefined) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }

  append(value = undefined) {
    return ListNode.create(value, this, this.next);
  }

  prepend(value = undefined) {
    return ListNode.create(value, this.prev, this);
  }

  unlink() {
    const { prev, next } = this;
    ListNode.link(prev, next);
    this.prev = null;
    this.next = null;
    return { prev, next };
  }

  seek(n = 0) {
    if (!Number.isInteger(n)) return null;
    let node = this;
    if (n > 0) {
      for (let i = 0; i < n && node; i++) node = node.next;
    } else if (n < 0) {
      for (let i = 0; i > n && node; i--) node = node.prev;
    }
    return node;
  }
}

class List {
  #head = null;
  #tail = null;
  #size = 0;

  static #create(head, tail, size) {
    const list = new List();
    list.#head = head;
    list.#tail = tail;
    list.#size = size;
    return list;
  }

  get size() {
    return this.#size;
  }

  static of(...values) {
    return List.fromArray(values);
  }

  static fromArray(values) {
    const { head, tail, size } = ListNode.fromArray(values);
    if (size === 0) return new List();
    return List.#create(head, tail, size);
  }

  static merge(...lists) {
    let head = null;
    let tail = null;
    let size = 0;
    for (let i = 0; i < lists.length; i++) {
      let node = lists[i].#head;
      while (node !== null) {
        tail = ListNode.create(node.value, tail);
        if (head === null) head = tail;
        size++;
        node = node.next;
      }
    }
    return List.#create(head, tail, size);
  }

  #nodeAt(index) {
    if (!Number.isInteger(index)) return null;
    const size = this.#size;
    const at = index < 0 ? index + size : index;
    if (at < 0 || at >= size) return null;
    if (at === 0) return this.#head;
    if (at === size - 1) return this.#tail;
    if (at < size - at) {
      let node = this.#head;
      for (let i = 0; i < at; i++) node = node.next;
      return node;
    }
    let node = this.#tail;
    for (let i = size - 1; i > at; i--) node = node.prev;
    return node;
  }

  #detach(node) {
    const { prev, next } = node.unlink();
    if (this.#head === node) this.#head = next;
    if (this.#tail === node) this.#tail = prev;
    this.#size--;
    return node.value;
  }

  #detachRange(first, last, count) {
    const { prev } = first;
    const { next } = last;
    if (prev !== null) prev.next = next;
    else this.#head = next;
    if (next !== null) next.prev = prev;
    else this.#tail = prev;
    first.prev = null;
    last.next = null;
    this.#size -= count;
  }

  #attach(head, tail, before) {
    if (before === null) {
      if (this.#tail === null) this.#head = head;
      else ListNode.link(this.#tail, head);
      this.#tail = tail;
      return;
    }
    const { prev } = before;
    if (prev !== null) ListNode.link(prev, head);
    else this.#head = head;
    ListNode.link(tail, before);
  }

  static #copyFrom(node, count) {
    if (count === 0) return new List();
    if (!isCount(count)) return null;
    const { head, tail } = ListNode.copy(node, count);
    return List.#create(head, tail, count);
  }

  append(...values) {
    const { length } = values;
    if (length === 0) return;
    const head = new ListNode(values[0]);
    let tail = head;
    for (let i = 1; i < length; i++) {
      tail = ListNode.create(values[i], tail);
    }
    this.#attach(head, tail, null);
    this.#size += length;
  }

  prepend(...values) {
    const { length } = values;
    if (length === 0) return;
    const head = new ListNode(values[0]);
    let tail = head;
    for (let i = 1; i < length; i++) {
      tail = ListNode.create(values[i], tail);
    }
    this.#attach(head, tail, this.#head);
    this.#size += length;
  }

  insert(index, ...values) {
    if (!Number.isInteger(index)) return;
    const { length } = values;
    if (length === 0) return;
    const size = this.#size;
    const at = index < 0 ? Math.max(0, index + size) : Math.min(index, size);
    const head = new ListNode(values[0]);
    let tail = head;
    for (let i = 1; i < length; i++) {
      tail = ListNode.create(values[i], tail);
    }
    const before = at < size ? this.#nodeAt(at) : null;
    this.#attach(head, tail, before);
    this.#size += length;
  }

  delete(index, count = 1) {
    if (!isCount(count) || !Number.isInteger(index)) return;
    const size = this.#size;
    const from = index < 0 ? index + size : index;
    if (from < 0 || from >= size) return;
    const actual = Math.min(count, size - from);
    const first = this.#nodeAt(from);
    const last = actual === 1 ? first : first.seek(actual - 1);
    this.#detachRange(first, last, actual);
  }

  at(index) {
    const node = this.#nodeAt(index);
    return node ? node.value : undefined;
  }

  set(index, value) {
    const node = this.#nodeAt(index);
    if (node) node.value = value;
  }

  drop(n) {
    if (!Number.isInteger(n) || n === 0 || this.#size === 0) return;
    if (n > 0) {
      const count = Math.min(n, this.#size);
      if (count === this.#size) return void this.clear();
      const first = this.#head;
      const last = first.seek(count - 1);
      return void this.#detachRange(first, last, count);
    }
    const count = Math.min(-n, this.#size);
    if (count === this.#size) return void this.clear();
    const last = this.#tail;
    const first = last.seek(1 - count);
    this.#detachRange(first, last, count);
  }

  take(n) {
    if (!Number.isInteger(n) || n === 0) return null;
    const size = this.#size;
    const count = Math.min(n > 0 ? n : -n, size);
    if (count === 0) return null;
    const node = n > 0 ? this.#head : this.#tail.seek(1 - count);
    return List.#copyFrom(node, count);
  }

  slice(start = 0, end) {
    if (!Number.isInteger(start)) return null;
    if (end !== undefined && !Number.isInteger(end)) return null;
    const size = this.#size;
    const from = start < 0 ? Math.max(0, start + size) : Math.min(start, size);
    const stop = end === undefined ? size : end;
    const to = stop < 0 ? Math.max(0, stop + size) : Math.min(stop, size);
    if (from >= to) return null;
    const node = from === 0 ? this.#head : this.#nodeAt(from);
    return List.#copyFrom(node, to - from);
  }

  rotate(n = 1) {
    const size = this.#size;
    if (size <= 1 || !Number.isInteger(n)) return;
    const steps = ((n % size) + size) % size;
    if (steps === 0) return;
    const node = this.#nodeAt(steps);
    const prev = node.prev;
    this.#tail.next = this.#head;
    this.#head.prev = this.#tail;
    this.#head = node;
    this.#tail = prev;
    node.prev = null;
    prev.next = null;
  }

  swap(i, j) {
    const nodeI = this.#nodeAt(i);
    const nodeJ = this.#nodeAt(j);
    if (!nodeI || !nodeJ) return;
    const value = nodeI.value;
    nodeI.value = nodeJ.value;
    nodeJ.value = value;
  }

  move(from, to) {
    if (!Number.isInteger(from) || !Number.isInteger(to)) return;
    const size = this.#size;
    const f = from < 0 ? from + size : from;
    const t = to < 0 ? to + size : to;
    if (f < 0 || f >= size || t < 0 || t >= size || f === t) return;
    const before = t >= size - 1 ? null : this.#nodeAt(f <= t ? t + 1 : t);
    const node = this.#nodeAt(f);
    const { prev, next } = node.unlink();
    if (this.#head === node) this.#head = next;
    if (this.#tail === node) this.#tail = prev;
    this.#attach(node, node, before);
  }

  splitAt(index) {
    const size = this.#size;
    let at = 0;
    if (Number.isInteger(index)) {
      at = index < 0 ? Math.max(0, index + size) : Math.min(index, size);
    }
    if (at === 0 || at === size) {
      const empty = new List();
      const copy = List.#copyFrom(this.#head, size);
      if (at === 0) return { before: empty, after: copy };
      return { before: copy, after: empty };
    }
    const before = { head: null, tail: null };
    const after = { head: null, tail: null };
    let node = this.#head;
    for (let i = 0; i < size; i++) {
      if (i < at) {
        before.tail = ListNode.create(node.value, before.tail);
        if (before.head === null) before.head = before.tail;
      } else {
        after.tail = ListNode.create(node.value, after.tail);
        if (after.head === null) after.head = after.tail;
      }
      node = node.next;
    }
    return {
      before: List.#create(before.head, before.tail, at),
      after: List.#create(after.head, after.tail, size - at),
    };
  }

  groupBy(getKey) {
    const groups = new Map();
    let node = this.#head;
    while (node !== null) {
      const groupKey = getKey(node.value);
      let group = groups.get(groupKey);
      if (group === undefined) {
        group = new List();
        groups.set(groupKey, group);
      }
      const item = ListNode.create(node.value, group.#tail);
      group.#tail = item;
      if (group.#head === null) group.#head = item;
      group.#size++;
      node = node.next;
    }
    return groups;
  }

  includes(value) {
    let node = this.#head;
    while (node) {
      if (sameValueZero(node.value, value)) return true;
      node = node.next;
    }
    return false;
  }

  indexOf(value) {
    let node = this.#head;
    let index = 0;
    while (node) {
      if (node.value === value) return index;
      node = node.next;
      index++;
    }
    return -1;
  }

  lastIndexOf(value) {
    let node = this.#tail;
    let index = this.#size - 1;
    while (node) {
      if (node.value === value) return index;
      node = node.prev;
      index--;
    }
    return -1;
  }

  remove(...values) {
    const { length } = values;
    if (length === 0) return 0;
    let removed = 0;
    let node = this.#head;
    const target = values[0];
    while (node !== null) {
      const next = node.next;
      if (length === 1) {
        if (sameValueZero(node.value, target)) {
          this.#detach(node);
          removed++;
        }
        node = next;
        continue;
      }
      for (let i = 0; i < length; i++) {
        if (sameValueZero(node.value, values[i])) {
          this.#detach(node);
          removed++;
          break;
        }
      }
      node = next;
    }
    return removed;
  }

  replace(oldValue, newValue) {
    let node = this.#head;
    while (node) {
      if (sameValueZero(node.value, oldValue)) node.value = newValue;
      node = node.next;
    }
  }

  reverse() {
    let node = this.#head;
    this.#head = this.#tail;
    this.#tail = node;
    while (node) {
      const { next } = node;
      node.next = node.prev;
      node.prev = next;
      node = next;
    }
  }

  toReversed() {
    let head = null;
    let tail = null;
    let node = this.#tail;
    while (node) {
      tail = ListNode.create(node.value, tail);
      if (head === null) head = tail;
      node = node.prev;
    }
    return List.#create(head, tail, this.#size);
  }

  sort(compare) {
    const array = this.toArray();
    array.sort(compare);
    let node = this.#head;
    for (let i = 0; i < array.length; i++) {
      node.value = array[i];
      node = node.next;
    }
  }

  toSorted(compare) {
    const array = this.toArray();
    array.sort(compare);
    return List.fromArray(array);
  }

  map(fn) {
    let head = null;
    let tail = null;
    let size = 0;
    let node = this.#head;
    let index = 0;
    while (node) {
      const value = fn(node.value, index);
      tail = ListNode.create(value, tail);
      if (head === null) head = tail;
      size++;
      node = node.next;
      index++;
    }
    return List.#create(head, tail, size);
  }

  flatMap(fn) {
    let head = null;
    let tail = null;
    let size = 0;
    let node = this.#head;
    while (node) {
      for (const value of fn(node.value)) {
        tail = ListNode.create(value, tail);
        if (head === null) head = tail;
        size++;
      }
      node = node.next;
    }
    return List.#create(head, tail, size);
  }

  filter(fn) {
    let head = null;
    let tail = null;
    let size = 0;
    let node = this.#head;
    let index = 0;
    while (node) {
      if (fn(node.value, index)) {
        tail = ListNode.create(node.value, tail);
        if (head === null) head = tail;
        size++;
      }
      node = node.next;
      index++;
    }
    return List.#create(head, tail, size);
  }

  reduce(fn, initial) {
    let acc = initial;
    let node = this.#head;
    let index = 0;
    while (node) {
      acc = fn(acc, node.value, index);
      node = node.next;
      index++;
    }
    return acc;
  }

  some(fn) {
    let node = this.#head;
    let index = 0;
    while (node) {
      if (fn(node.value, index)) return true;
      node = node.next;
      index++;
    }
    return false;
  }

  every(fn) {
    let node = this.#head;
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
    let node = this.#head;
    let index = 0;
    while (node) {
      if (fn(node.value, index)) return node.value;
      node = node.next;
      index++;
    }
    return result;
  }

  findIndex(fn) {
    let node = this.#head;
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
    let node = this.#head;
    if (fn) {
      while (node) {
        total += fn(node.value);
        node = node.next;
      }
    } else {
      while (node) {
        total += node.value;
        node = node.next;
      }
    }
    return total;
  }

  avg(fn) {
    const size = this.#size;
    return size === 0 ? 0 : this.sum(fn) / size;
  }

  min(compare = compareAsc) {
    let result = undefined;
    let node = this.#head;
    if (node === null) return result;
    result = node.value;
    node = node.next;
    while (node) {
      if (compare(node.value, result) < 0) result = node.value;
      node = node.next;
    }
    return result;
  }

  max(compare = compareAsc) {
    let result = undefined;
    let node = this.#head;
    if (node === null) return result;
    result = node.value;
    node = node.next;
    while (node) {
      if (compare(node.value, result) > 0) result = node.value;
      node = node.next;
    }
    return result;
  }

  isEmpty() {
    return this.#size === 0;
  }

  clear() {
    this.#head = null;
    this.#tail = null;
    this.#size = 0;
  }

  toArray() {
    const { size } = this;
    const array = new Array(size);
    let node = this.#head;
    for (let i = 0; i < size; i++) {
      array[i] = node.value;
      node = node.next;
    }
    return array;
  }

  clone() {
    return List.#copyFrom(this.#head, this.#size);
  }

  [Symbol.iterator]() {
    let node = this.#head;
    return {
      next() {
        if (node === null) return { done: true, value: undefined };
        const { value } = node;
        node = node.next;
        return { done: false, value };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }
}

module.exports = { List, ListNode };
