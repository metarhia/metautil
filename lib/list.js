'use strict';

const compareAsc = (a, b) => {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
};

const clampIndex = (index, size) => {
  const at = index < 0 ? index + size : index;
  if (at < 0) return 0;
  return at > size ? size : at;
};

class ListNode {
  static fromArray(values) {
    const { length } = values;
    if (length === 0) return { head: null, tail: null, size: 0 };
    const head = new ListNode(values[0]);
    let tail = head;
    for (let i = 1; i < length; i++) {
      const node = new ListNode(values[i]);
      node.prev = tail;
      tail.next = node;
      tail = node;
    }
    return { head, tail, size: length };
  }

  static copy(node, count) {
    if (!Number.isInteger(count) || count <= 0) {
      return { head: null, tail: null, next: node, size: 0 };
    }
    const head = new ListNode(node.value);
    let tail = head;
    let current = node.next;
    for (let i = 1; i < count; i++) {
      const copied = new ListNode(current.value);
      copied.prev = tail;
      tail.next = copied;
      tail = copied;
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
    const prev = this.prev;
    const next = this.next;
    if (prev !== null) prev.next = next;
    if (next !== null) next.prev = prev;
    this.prev = null;
    this.next = null;
    return { prev, next };
  }

  seek(n = 0) {
    if (!Number.isInteger(n)) return null;
    let node = this;
    if (n > 0) {
      for (let i = 0; i < n && node !== null; i++) node = node.next;
    } else if (n < 0) {
      for (let i = 0; i > n && node !== null; i--) node = node.prev;
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
    return List.#create(head, tail, size);
  }

  static merge(...lists) {
    const result = new List();
    const { length } = lists;
    for (let i = 0; i < length; i++) {
      let node = lists[i].#head;
      while (node !== null) {
        const item = new ListNode(node.value);
        const tail = result.#tail;
        if (tail === null) {
          result.#head = item;
        } else {
          tail.next = item;
          item.prev = tail;
        }
        result.#tail = item;
        result.#size++;
        node = node.next;
      }
    }
    return result;
  }

  #nodeAt(index) {
    if (!Number.isInteger(index)) return null;
    const size = this.#size;
    const at = index < 0 ? index + size : index;
    if (at < 0 || at >= size) return null;
    const fromEnd = size - 1 - at;
    if (at <= fromEnd) {
      let node = this.#head;
      for (let i = 0; i < at; i++) node = node.next;
      return node;
    }
    let node = this.#tail;
    for (let i = 0; i < fromEnd; i++) node = node.prev;
    return node;
  }

  #detachRange(first, last, count) {
    const prev = first.prev;
    const next = last.next;
    if (prev === null) this.#head = next;
    else prev.next = next;
    if (next === null) this.#tail = prev;
    else next.prev = prev;
    first.prev = null;
    last.next = null;
    this.#size -= count;
  }

  // `before === null` attaches the chain at the tail
  #attach(head, tail, count, before) {
    const prev = before === null ? this.#tail : before.prev;
    if (prev === null) {
      this.#head = head;
    } else {
      prev.next = head;
      head.prev = prev;
    }
    if (before === null) {
      this.#tail = tail;
    } else {
      tail.next = before;
      before.prev = tail;
    }
    this.#size += count;
  }

  static #copyFrom(node, count) {
    const { head, tail, size } = ListNode.copy(node, count);
    return List.#create(head, tail, size);
  }

  append(...values) {
    const { length } = values;
    if (length === 0) return;
    const head = new ListNode(values[0]);
    let tail = head;
    for (let i = 1; i < length; i++) {
      const node = new ListNode(values[i]);
      node.prev = tail;
      tail.next = node;
      tail = node;
    }
    const last = this.#tail;
    if (last === null) {
      this.#head = head;
    } else {
      last.next = head;
      head.prev = last;
    }
    this.#tail = tail;
    this.#size += length;
  }

  prepend(...values) {
    const { length } = values;
    if (length === 0) return;
    const head = new ListNode(values[0]);
    let tail = head;
    for (let i = 1; i < length; i++) {
      const node = new ListNode(values[i]);
      node.prev = tail;
      tail.next = node;
      tail = node;
    }
    const first = this.#head;
    if (first === null) {
      this.#tail = tail;
    } else {
      tail.next = first;
      first.prev = tail;
    }
    this.#head = head;
    this.#size += length;
  }

  insert(index, ...values) {
    if (!Number.isInteger(index)) return;
    const { length } = values;
    if (length === 0) return;
    const size = this.#size;
    const at = clampIndex(index, size);
    const head = new ListNode(values[0]);
    let tail = head;
    for (let i = 1; i < length; i++) {
      const node = new ListNode(values[i]);
      node.prev = tail;
      tail.next = node;
      tail = node;
    }
    const before = at === size ? null : this.#nodeAt(at);
    this.#attach(head, tail, length, before);
  }

  delete(index, count = 1) {
    if (!Number.isInteger(index)) return;
    if (!Number.isInteger(count) || count <= 0) return;
    const size = this.#size;
    const from = index < 0 ? index + size : index;
    if (from < 0 || from >= size) return;
    const actual = Math.min(count, size - from);
    const first = this.#nodeAt(from);
    let last = first;
    for (let i = 1; i < actual; i++) last = last.next;
    this.#detachRange(first, last, actual);
  }

  at(index) {
    const node = this.#nodeAt(index);
    return node === null ? undefined : node.value;
  }

  set(index, value) {
    const node = this.#nodeAt(index);
    if (node !== null) node.value = value;
  }

  drop(n) {
    if (!Number.isInteger(n) || n === 0) return;
    const size = this.#size;
    if (size === 0) return;
    if (n > 0) {
      if (n >= size) return void this.clear();
      const lastDropped = this.#nodeAt(n - 1);
      this.#detachRange(this.#head, lastDropped, n);
      return;
    }
    const count = -n;
    if (count >= size) return void this.clear();
    const firstDropped = this.#nodeAt(size - count);
    this.#detachRange(firstDropped, this.#tail, count);
  }

  take(n) {
    if (!Number.isInteger(n) || n === 0) return null;
    const size = this.#size;
    if (size === 0) return null;
    if (n > 0) {
      const count = Math.min(n, size);
      return List.#copyFrom(this.#head, count);
    }
    const count = Math.min(-n, size);
    const firstTaken = this.#nodeAt(size - count);
    return List.#copyFrom(firstTaken, count);
  }

  slice(start = 0, end) {
    if (!Number.isInteger(start)) return null;
    if (end !== undefined && !Number.isInteger(end)) return null;
    const size = this.#size;
    const from = clampIndex(start, size);
    const to = end === undefined ? size : clampIndex(end, size);
    if (from >= to) return null;
    const first = this.#nodeAt(from);
    return List.#copyFrom(first, to - from);
  }

  rotate(n = 1) {
    const size = this.#size;
    if (size <= 1 || !Number.isInteger(n)) return;
    const steps = ((n % size) + size) % size;
    if (steps === 0) return;
    const node = this.#nodeAt(steps);
    const head = this.#head;
    const tail = this.#tail;
    const prev = node.prev;
    tail.next = head;
    head.prev = tail;
    node.prev = null;
    prev.next = null;
    this.#head = node;
    this.#tail = prev;
  }

  swap(i, j) {
    const nodeI = this.#nodeAt(i);
    const nodeJ = this.#nodeAt(j);
    if (nodeI === null || nodeJ === null) return;
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
    const node = this.#nodeAt(f);
    let before = null;
    if (t < size - 1) {
      const beforeIndex = f < t ? t + 1 : t;
      before = this.#nodeAt(beforeIndex);
    }
    this.#detachRange(node, node, 1);
    this.#attach(node, node, 1, before);
  }

  splitAt(index) {
    const size = this.#size;
    const at = Number.isInteger(index) ? clampIndex(index, size) : 0;
    const splitNode = this.#nodeAt(at);
    const before = List.#copyFrom(this.#head, at);
    const after = List.#copyFrom(splitNode, size - at);
    return { before, after };
  }

  groupBy(getKey) {
    const groups = new Map();
    let node = this.#head;
    while (node !== null) {
      const key = getKey(node.value);
      let group = groups.get(key);
      if (group === undefined) {
        group = new List();
        groups.set(key, group);
      }
      const item = new ListNode(node.value);
      const tail = group.#tail;
      if (tail === null) {
        group.#head = item;
      } else {
        tail.next = item;
        item.prev = tail;
      }
      group.#tail = item;
      group.#size++;
      node = node.next;
    }
    return groups;
  }

  includes(value) {
    let node = this.#head;
    while (node !== null) {
      if (node.value === value) return true;
      node = node.next;
    }
    return false;
  }

  indexOf(value) {
    let node = this.#head;
    let index = 0;
    while (node !== null) {
      if (node.value === value) return index;
      node = node.next;
      index++;
    }
    return -1;
  }

  lastIndexOf(value) {
    let node = this.#tail;
    let index = this.#size - 1;
    while (node !== null) {
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
    if (length === 1) {
      const target = values[0];
      while (node !== null) {
        const next = node.next;
        if (node.value === target) {
          this.#detachRange(node, node, 1);
          removed++;
        }
        node = next;
      }
      return removed;
    }
    while (node !== null) {
      const next = node.next;
      for (let i = 0; i < length; i++) {
        if (node.value === values[i]) {
          this.#detachRange(node, node, 1);
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
    while (node !== null) {
      if (node.value === oldValue) {
        node.value = newValue;
      }
      node = node.next;
    }
  }

  reverse() {
    let node = this.#head;
    this.#head = this.#tail;
    this.#tail = node;
    while (node !== null) {
      const next = node.next;
      node.next = node.prev;
      node.prev = next;
      node = next;
    }
  }

  toReversed() {
    let node = this.#tail;
    if (node === null) return new List();
    const head = new ListNode(node.value);
    let tail = head;
    node = node.prev;
    while (node !== null) {
      const copied = new ListNode(node.value);
      copied.prev = tail;
      tail.next = copied;
      tail = copied;
      node = node.prev;
    }
    return List.#create(head, tail, this.#size);
  }

  sort(compare) {
    const array = this.toArray();
    array.sort(compare);
    const { length } = array;
    let node = this.#head;
    for (let i = 0; i < length; i++) {
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
    let node = this.#head;
    if (node === null) return new List();
    const size = this.#size;
    const first = fn(node.value, 0);
    const head = new ListNode(first);
    let tail = head;
    node = node.next;
    for (let index = 1; index < size; index++) {
      const mapped = fn(node.value, index);
      const item = new ListNode(mapped);
      item.prev = tail;
      tail.next = item;
      tail = item;
      node = node.next;
    }
    return List.#create(head, tail, size);
  }

  flatMap(fn) {
    let head = null;
    let tail = null;
    let size = 0;
    let node = this.#head;
    while (node !== null) {
      const values = fn(node.value);
      for (const value of values) {
        const item = new ListNode(value);
        if (tail === null) {
          head = item;
        } else {
          tail.next = item;
          item.prev = tail;
        }
        tail = item;
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
    while (node !== null) {
      const value = node.value;
      if (fn(value, index)) {
        const item = new ListNode(value);
        if (tail === null) {
          head = item;
        } else {
          tail.next = item;
          item.prev = tail;
        }
        tail = item;
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
    while (node !== null) {
      acc = fn(acc, node.value, index);
      node = node.next;
      index++;
    }
    return acc;
  }

  some(fn) {
    let node = this.#head;
    let index = 0;
    while (node !== null) {
      if (fn(node.value, index)) return true;
      node = node.next;
      index++;
    }
    return false;
  }

  every(fn) {
    let node = this.#head;
    let index = 0;
    while (node !== null) {
      if (!fn(node.value, index)) return false;
      node = node.next;
      index++;
    }
    return true;
  }

  find(fn) {
    const result = undefined;
    let node = this.#head;
    let index = 0;
    while (node !== null) {
      const value = node.value;
      if (fn(value, index)) return value;
      node = node.next;
      index++;
    }
    return result;
  }

  findIndex(fn) {
    let node = this.#head;
    let index = 0;
    while (node !== null) {
      if (fn(node.value, index)) return index;
      node = node.next;
      index++;
    }
    return -1;
  }

  sum(fn) {
    let total = 0;
    let node = this.#head;
    if (fn !== undefined) {
      while (node !== null) {
        total += fn(node.value);
        node = node.next;
      }
      return total;
    }
    while (node !== null) {
      total += node.value;
      node = node.next;
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
    while (node !== null) {
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
    while (node !== null) {
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
    const size = this.#size;
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
        const value = node.value;
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
