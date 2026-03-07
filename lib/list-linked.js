'use strict';

class LinkedList {
  #head = null;
  #tail = null;
  #size = 0;
  #asyncQueue = [];
  #asyncIndex = 0;

  constructor() {}

  get size() {
    return this.#size;
  }

  #createNode(value, prev = null, next = null) {
    return { prev, next, value };
  }

  #nodeAt(index) {
    if (index < 0 || index >= this.#size) return null;
    let node;
    if (index < this.#size / 2) {
      node = this.#head;
      for (let i = 0; i < index; i++) {
        node = node.next;
      }
    } else {
      node = this.#tail;
      for (let i = this.#size - 1; i > index; i--) {
        node = node.prev;
      }
    }
    return node;
  }

  #unlinkNode(node) {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.#head = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.#tail = node.prev;
    }
    this.#size--;
    return node.value;
  }

  #insertBefore(node, value) {
    const newNode = this.#createNode(value, node.prev, node);
    if (node.prev) {
      node.prev.next = newNode;
    } else {
      this.#head = newNode;
    }
    node.prev = newNode;
    this.#size++;
    return newNode;
  }

  [Symbol.iterator]() {
    let current = this.#head;
    return {
      next() {
        if (current === null) {
          return { done: true };
        }
        const value = current.value;
        current = current.next;
        return { value, done: false };
      },
    };
  }

  toArray() {
    const arr = new Array(this.#size);
    let i = 0;
    for (const value of this) {
      arr[i++] = value;
    }
    return arr;
  }

  clone() {
    const list = new LinkedList();
    for (const value of this) {
      list.append(value);
    }
    return list;
  }

  clear() {
    this.#head = null;
    this.#tail = null;
    this.#size = 0;
  }

  at(index) {
    const i = index < 0 ? this.#size + index : index;
    const node = this.#nodeAt(i);
    return node ? node.value : undefined;
  }

  set(index, value) {
    const i = index < 0 ? this.#size + index : index;
    if (i >= 0 && i < this.#size) {
      const node = this.#nodeAt(i);
      if (node) {
        node.value = value;
      }
    }
  }

  first() {
    return this.#head ? this.#head.value : undefined;
  }

  last() {
    return this.#tail ? this.#tail.value : undefined;
  }

  append(value) {
    const node = this.#createNode(value, this.#tail, null);
    if (this.#tail) {
      this.#tail.next = node;
    } else {
      this.#head = node;
    }
    this.#tail = node;
    this.#size++;
    this.#resolveNextAsync();
  }

  #resolveNextAsync() {
    if (this.#asyncQueue.length > 0 && this.#asyncIndex < this.#size) {
      const { resolve } = this.#asyncQueue.shift();
      const node = this.#nodeAt(this.#asyncIndex++);
      resolve({ value: node.value, done: false });
    }
  }

  prepend(value) {
    const node = this.#createNode(value, null, this.#head);
    if (this.#head) this.#head.prev = node;
    else this.#tail = node;
    this.#head = node;
    this.#size++;
  }

  insert(index, value, count = 1) {
    if (index <= 0) {
      for (let i = 0; i < count; i++) {
        this.prepend(value);
      }
    } else if (index >= this.#size) {
      for (let i = 0; i < count; i++) {
        this.append(value);
      }
    } else {
      const node = this.#nodeAt(index);
      for (let i = 0; i < count; i++) {
        this.#insertBefore(node, value);
      }
    }
  }

  delete(index, count = 1) {
    const i = index < 0 ? this.#size + index : index;
    for (let j = 0; j < count && i < this.#size; j++) {
      const node = this.#nodeAt(i);
      if (node) {
        this.#unlinkNode(node);
      }
    }
  }

  enqueue(value) {
    this.append(value);
  }

  dequeue() {
    return this.#head ? this.#unlinkNode(this.#head) : undefined;
  }

  slice(start, end) {
    const list = new LinkedList();
    const len = this.#size;
    let s = start === undefined ? 0 : start;

    if (s < 0) {
      s = Math.max(len + s, 0);
    }

    let e = end === undefined ? len : end;
    if (e < 0) {
      e = Math.max(len + e, 0);
    } else {
      e = Math.min(e, len);
    }

    if (s >= e) {
      return list;
    }

    let node = this.#nodeAt(s);
    for (let i = s; i < e && node; i++) {
      list.append(node.value);
      node = node.next;
    }
    return list;
  }

  head() {
    return this.slice(0, -1);
  }

  tail() {
    return this.slice(1);
  }

  take(n) {
    if (n >= 0) {
      return this.slice(0, n);
    }
    return this.slice(n);
  }

  drop(n) {
    if (n >= 0) {
      for (let i = 0; i < n && this.#head; i++) {
        this.#unlinkNode(this.#head);
      }
    } else {
      const count = -n;
      for (let i = 0; i < count && this.#tail; i++) {
        this.#unlinkNode(this.#tail);
      }
    }
  }

  splitAt(index) {
    const before = new LinkedList();
    const after = new LinkedList();
    let i = 0;
    for (const value of this) {
      if (i < index) {
        before.append(value);
      } else {
        after.append(value);
      }
      i++;
    }
    return { before, after };
  }

  includes(value) {
    for (const v of this) {
      if (v === value) {
        return true;
      }
    }
    return false;
  }

  indexOf(value) {
    let i = 0;
    for (const v of this) {
      if (v === value) {
        return i;
      }
      i++;
    }
    return -1;
  }

  lastIndexOf(value) {
    let index = -1;
    let i = 0;
    for (const v of this) {
      if (v === value) {
        index = i;
      }
      i++;
    }
    return index;
  }

  find(fn) {
    let result;
    for (const v of this) {
      if (fn(v)) {
        result = v;
        break;
      }
    }
    return result;
  }

  findIndex(fn) {
    let i = 0;
    for (const v of this) {
      if (fn(v)) {
        return i;
      }
      i++;
    }
    return -1;
  }

  equals(other) {
    if (this.#size !== other.size) {
      return false;
    }
    const iter = other[Symbol.iterator]();
    for (const v of this) {
      const { value } = iter.next();
      if (v !== value) {
        return false;
      }
    }
    return true;
  }

  addAll(values) {
    for (const value of values) {
      this.append(value);
    }
  }

  removeAll(values) {
    const toRemove = new Set(values);
    let node = this.#head;
    while (node) {
      const next = node.next;
      if (toRemove.has(node.value)) {
        this.#unlinkNode(node);
      }
      node = next;
    }
  }

  fill(value, start = 0, end = this.#size) {
    const len = this.#size;
    const s = start < 0 ? Math.max(len + start, 0) : start;
    const e = end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
    let node = this.#nodeAt(s);
    for (let i = s; i < e && node; i++) {
      node.value = value;
      node = node.next;
    }
  }

  replace(oldValue, newValue) {
    for (let node = this.#head; node; node = node.next) {
      if (node.value === oldValue) {
        node.value = newValue;
        return;
      }
    }
  }

  swap(i, j) {
    const a = i < 0 ? this.#size + i : i;
    const b = j < 0 ? this.#size + j : j;
    const nodeA = this.#nodeAt(a);
    const nodeB = this.#nodeAt(b);
    if (nodeA && nodeB) {
      [nodeA.value, nodeB.value] = [nodeB.value, nodeA.value];
    }
  }

  move(from, to) {
    if (from === to) {
      return;
    }
    const node = this.#nodeAt(from);
    if (!node) {
      return;
    }
    const value = this.#unlinkNode(node);
    this.insert(to, value);
  }

  rotate(n) {
    if (this.#size === 0) {
      return;
    }
    const len = this.#size;
    const shift = ((n % len) + len) % len;
    if (shift === 0) {
      return;
    }
    const arr = this.toArray();
    this.clear();
    for (let i = 0; i < len; i++) {
      this.append(arr[(len - shift + i) % len]);
    }
  }

  rotateLeft(steps = 1) {
    this.rotate(-steps);
  }

  rotateRight(steps = 1) {
    this.rotate(steps);
  }

  reverse() {
    let node = this.#head;
    while (node) {
      [node.prev, node.next] = [node.next, node.prev];
      node = node.prev;
    }
    [this.#head, this.#tail] = [this.#tail, this.#head];
  }

  toReversed() {
    const list = new LinkedList();
    for (let node = this.#tail; node; node = node.prev) {
      list.append(node.value);
    }
    return list;
  }

  sort(compare) {
    const arr = this.toArray();
    arr.sort(compare);
    this.clear();
    for (const v of arr) {
      this.append(v);
    }
  }

  toSorted(compare) {
    const arr = this.toArray();
    arr.sort(compare);
    const list = new LinkedList();
    for (const v of arr) {
      list.append(v);
    }
    return list;
  }

  shuffle(random = Math.random) {
    const arr = this.toArray();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    this.clear();
    for (const v of arr) {
      this.append(v);
    }
  }

  toShuffled(random = Math.random) {
    const list = this.clone();
    list.shuffle(random);
    return list;
  }

  distinct() {
    const seen = new Set();
    let node = this.#head;
    while (node) {
      const next = node.next;
      if (seen.has(node.value)) {
        this.#unlinkNode(node);
      } else {
        seen.add(node.value);
      }
      node = next;
    }
  }

  toDistinct() {
    const list = new LinkedList();
    const seen = new Set();
    for (const v of this) {
      if (!seen.has(v)) {
        seen.add(v);
        list.append(v);
      }
    }
    return list;
  }

  map(fn) {
    const list = new LinkedList();
    let i = 0;
    for (const v of this) {
      list.append(fn(v, i++));
    }
    return list;
  }

  flatMap(fn) {
    const list = new LinkedList();
    for (const v of this) {
      const result = fn(v);
      if (result[Symbol.iterator]) {
        for (const item of result) {
          list.append(item);
        }
      } else {
        list.append(result);
      }
    }
    return list;
  }

  filter(fn) {
    const list = new LinkedList();
    let i = 0;
    for (const v of this) {
      if (fn(v, i++)) {
        list.append(v);
      }
    }
    return list;
  }

  reduce(fn, initial) {
    let acc = initial;
    let i = 0;
    for (const v of this) {
      acc = fn(acc, v, i++);
    }
    return acc;
  }

  some(fn) {
    for (const v of this) {
      if (fn(v)) {
        return true;
      }
    }
    return false;
  }

  every(fn) {
    for (const v of this) {
      if (!fn(v)) {
        return false;
      }
    }
    return true;
  }

  sum(fn) {
    if (this.#size === 0) {
      return 0;
    }
    let total = 0;
    for (const v of this) {
      total += fn ? fn(v) : v;
    }
    return total;
  }

  avg(fn) {
    if (this.#size === 0) {
      return NaN;
    }
    return this.sum(fn) / this.#size;
  }

  min(compareFn) {
    let minVal = this.#head?.value;
    for (const v of this) {
      if (compareFn && compareFn(v, minVal) < 0) {
        minVal = v;
      } else if (!compareFn && v < minVal) {
        minVal = v;
      }
    }
    return minVal;
  }

  max(compareFn) {
    let maxVal = this.#head?.value;
    for (const v of this) {
      if (compareFn && compareFn(v, maxVal) > 0) {
        maxVal = v;
      } else if (!compareFn && v > maxVal) {
        maxVal = v;
      }
    }
    return maxVal;
  }

  groupBy(key) {
    const groups = new Map();
    for (const value of this) {
      const k = key(value);
      if (!groups.has(k)) {
        groups.set(k, new LinkedList());
      }
      groups.get(k).append(value);
    }
    return groups;
  }

  *lazyMap(fn) {
    let i = 0;
    for (const v of this) {
      yield fn(v, i++);
    }
  }

  *lazyFilter(fn) {
    let i = 0;
    for (const v of this) {
      if (fn(v, i++)) {
        yield v;
      }
    }
  }

  *lazyReduce(fn, initial) {
    let acc = initial;
    let i = 0;
    for (const v of this) {
      acc = fn(acc, v, i++);
      yield acc;
    }
  }

  join(separator = ',') {
    return this.toArray().join(separator);
  }

  [Symbol.asyncIterator]() {
    const list = this;
    let index = this.#asyncIndex;
    let currentNode = this.#nodeAt(index);

    return {
      next() {
        if (index < list.#size) {
          const value = currentNode.value;
          currentNode = currentNode.next;
          index++;
          return Promise.resolve({ value, done: false });
        }
        list.#asyncIndex = index;
        return new Promise((resolve) => {
          list.#asyncQueue.push({ resolve });
        });
      },

      return() {
        list.#asyncQueue.length = 0;
        return Promise.resolve({ done: true });
      },
    };
  }

  static fromArray(values) {
    const list = new LinkedList();
    for (const v of values) {
      list.append(v);
    }
    return list;
  }

  static fromIterator(iterator) {
    const list = new LinkedList();
    for (const value of iterator) {
      list.append(value);
    }
    return list;
  }

  static range(start, end, step = 1) {
    const list = new LinkedList();
    if (step > 0) {
      for (let i = start; i < end; i += step) {
        list.append(i);
      }
    } else if (step < 0) {
      for (let i = start; i > end; i += step) {
        list.append(i);
      }
    }
    return list;
  }

  static merge(lists) {
    const list = new LinkedList();
    for (const source of lists) {
      for (const value of source) {
        list.append(value);
      }
    }
    return list;
  }
}

module.exports = { LinkedList };
