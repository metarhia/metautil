'use strict';

const DEFAULT_NODE_SIZE = 64;

class UnrolledList {
  #head = null;
  #tail = null;
  #size = 0;
  #nodeSize;
  #asyncQueue = [];
  #asyncIndex = 0;

  constructor(options = {}) {
    this.#nodeSize = options.nodeSize || DEFAULT_NODE_SIZE;
  }

  get size() {
    return this.#size;
  }

  #createNode(prev = null, next = null) {
    return {
      buffer: new Array(this.#nodeSize),
      start: 0,
      end: 0,
      prev,
      next,
    };
  }

  #nodeAt(index) {
    if (index < 0 || index >= this.#size) return null;
    let node = this.#head;
    let offset = index;
    while (node) {
      const count = node.end - node.start;
      if (offset < count) {
        return { node, localIndex: node.start + offset };
      }
      offset -= count;
      node = node.next;
    }
    return null;
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
  }

  [Symbol.iterator]() {
    let node = this.#head;
    let localIndex = node ? node.start : 0;
    return {
      next() {
        while (node) {
          if (localIndex < node.end) {
            return { value: node.buffer[localIndex++], done: false };
          }
          node = node.next;
          localIndex = node ? node.start : 0;
        }
        return { done: true };
      },
    };
  }

  toArray() {
    const arr = [];
    for (const value of this) {
      arr.push(value);
    }
    return arr;
  }

  clone() {
    const list = new UnrolledList({ nodeSize: this.#nodeSize });
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
    const result = this.#nodeAt(i);
    return result ? result.node.buffer[result.localIndex] : undefined;
  }

  set(index, value) {
    const i = index < 0 ? this.#size + index : index;
    if (i >= 0 && i < this.#size) {
      const result = this.#nodeAt(i);
      if (result) {
        result.node.buffer[result.localIndex] = value;
      }
    }
  }

  first() {
    return this.#head ? this.#head.buffer[this.#head.start] : undefined;
  }

  last() {
    return this.#tail ? this.#tail.buffer[this.#tail.end - 1] : undefined;
  }

  append(value) {
    if (!this.#tail || this.#tail.end >= this.#nodeSize) {
      const node = this.#createNode(this.#tail, null);
      if (this.#tail) {
        this.#tail.next = node;
      } else {
        this.#head = node;
      }
      this.#tail = node;
    }
    this.#tail.buffer[this.#tail.end++] = value;
    this.#size++;
    this.#resolveNextAsync();
  }

  #resolveNextAsync() {
    if (this.#asyncQueue.length > 0 && this.#asyncIndex < this.#size) {
      const { resolve } = this.#asyncQueue.shift();
      const result = this.#nodeAt(this.#asyncIndex++);
      resolve({ value: result.node.buffer[result.localIndex], done: false });
    }
  }

  prepend(value) {
    if (!this.#head || this.#head.start === 0) {
      if (this.#head && this.#head.end < this.#nodeSize) {
        for (let i = this.#head.end; i > this.#head.start; i--) {
          this.#head.buffer[i] = this.#head.buffer[i - 1];
        }
        this.#head.end++;
        this.#head.buffer[this.#head.start] = value;
      } else {
        const node = this.#createNode(null, this.#head);
        node.end = 1;
        node.buffer[0] = value;
        if (this.#head) {
          this.#head.prev = node;
        } else {
          this.#tail = node;
        }
        this.#head = node;
      }
    } else {
      this.#head.buffer[--this.#head.start] = value;
    }
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
      for (let i = 0; i < count; i++) {
        this.#insertAt(index, value);
      }
    }
  }

  #insertAt(index, value) {
    const result = this.#nodeAt(index);
    if (!result) return;
    const { node, localIndex } = result;

    if (node.end < this.#nodeSize) {
      for (let i = node.end; i > localIndex; i--) {
        node.buffer[i] = node.buffer[i - 1];
      }
      node.buffer[localIndex] = value;
      node.end++;
      this.#size++;
    } else {
      const newNode = this.#createNode(node, node.next);
      const mid = Math.floor((node.end - node.start) / 2);
      const splitPoint = node.start + mid;

      for (let i = splitPoint; i < node.end; i++) {
        newNode.buffer[newNode.end++] = node.buffer[i];
      }
      node.end = splitPoint;

      if (node.next) {
        node.next.prev = newNode;
      } else {
        this.#tail = newNode;
      }
      node.next = newNode;

      if (localIndex <= splitPoint) {
        for (let i = node.end; i > localIndex; i--) {
          node.buffer[i] = node.buffer[i - 1];
        }
        node.buffer[localIndex] = value;
        node.end++;
      } else {
        const newLocalIndex = localIndex - splitPoint;
        for (let i = newNode.end; i > newLocalIndex; i--) {
          newNode.buffer[i] = newNode.buffer[i - 1];
        }
        newNode.buffer[newLocalIndex] = value;
        newNode.end++;
      }
      this.#size++;
    }
  }

  delete(index, count = 1) {
    const i = index < 0 ? this.#size + index : index;
    for (let j = 0; j < count && i < this.#size; j++) {
      this.#deleteAt(i);
    }
  }

  #deleteAt(index) {
    const result = this.#nodeAt(index);
    if (!result) return;
    const { node, localIndex } = result;

    for (let i = localIndex; i < node.end - 1; i++) {
      node.buffer[i] = node.buffer[i + 1];
    }
    node.end--;
    this.#size--;

    if (node.start === node.end) {
      this.#unlinkNode(node);
    }
  }

  enqueue(value) {
    this.append(value);
  }

  dequeue() {
    return this.#head ? this.#dequeueHead() : undefined;
  }

  #dequeueHead() {
    const value = this.#head.buffer[this.#head.start++];
    this.#size--;
    if (this.#head.start === this.#head.end) {
      this.#unlinkNode(this.#head);
    }
    return value;
  }

  slice(start, end) {
    const list = new UnrolledList({ nodeSize: this.#nodeSize });
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

    let idx = 0;
    for (const value of this) {
      if (idx >= s && idx < e) {
        list.append(value);
      }
      idx++;
      if (idx >= e) break;
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
        this.dequeue();
      }
    } else {
      const count = -n;
      for (let i = 0; i < count && this.#tail; i++) {
        this.#tail.end--;
        this.#size--;
        if (this.#tail.start === this.#tail.end) {
          this.#unlinkNode(this.#tail);
        }
      }
    }
  }

  splitAt(index) {
    const before = new UnrolledList({ nodeSize: this.#nodeSize });
    const after = new UnrolledList({ nodeSize: this.#nodeSize });
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
    const arr = this.toArray().filter((v) => !toRemove.has(v));
    this.clear();
    for (const v of arr) {
      this.append(v);
    }
  }

  fill(value, start = 0, end = this.#size) {
    const len = this.#size;
    const s = start < 0 ? Math.max(len + start, 0) : start;
    const e = end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
    let idx = 0;
    let node = this.#head;
    let localIndex = node ? node.start : 0;
    while (node && idx < e) {
      if (localIndex < node.end) {
        if (idx >= s) {
          node.buffer[localIndex] = value;
        }
        localIndex++;
        idx++;
      } else {
        node = node.next;
        localIndex = node ? node.start : 0;
      }
    }
  }

  replace(oldValue, newValue) {
    let node = this.#head;
    while (node) {
      for (let i = node.start; i < node.end; i++) {
        if (node.buffer[i] === oldValue) {
          node.buffer[i] = newValue;
          return;
        }
      }
      node = node.next;
    }
  }

  swap(i, j) {
    const a = i < 0 ? this.#size + i : i;
    const b = j < 0 ? this.#size + j : j;
    const resultA = this.#nodeAt(a);
    const resultB = this.#nodeAt(b);
    if (resultA && resultB) {
      const temp = resultA.node.buffer[resultA.localIndex];
      resultA.node.buffer[resultA.localIndex] =
        resultB.node.buffer[resultB.localIndex];
      resultB.node.buffer[resultB.localIndex] = temp;
    }
  }

  move(from, to) {
    if (from === to) {
      return;
    }
    const result = this.#nodeAt(from);
    if (!result) {
      return;
    }
    const value = result.node.buffer[result.localIndex];
    this.#deleteAt(from);
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
    const arr = this.toArray();
    arr.reverse();
    this.clear();
    for (const v of arr) {
      this.append(v);
    }
  }

  toReversed() {
    const list = new UnrolledList({ nodeSize: this.#nodeSize });
    const arr = this.toArray();
    for (let i = arr.length - 1; i >= 0; i--) {
      list.append(arr[i]);
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
    const list = new UnrolledList({ nodeSize: this.#nodeSize });
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
    const arr = [];
    for (const v of this) {
      if (!seen.has(v)) {
        seen.add(v);
        arr.push(v);
      }
    }
    this.clear();
    for (const v of arr) {
      this.append(v);
    }
  }

  toDistinct() {
    const list = new UnrolledList({ nodeSize: this.#nodeSize });
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
    const list = new UnrolledList({ nodeSize: this.#nodeSize });
    let i = 0;
    for (const v of this) {
      list.append(fn(v, i++));
    }
    return list;
  }

  flatMap(fn) {
    const list = new UnrolledList({ nodeSize: this.#nodeSize });
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
    const list = new UnrolledList({ nodeSize: this.#nodeSize });
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
    let minVal = this.#head ? this.#head.buffer[this.#head.start] : undefined;
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
    let maxVal = this.#head ? this.#head.buffer[this.#head.start] : undefined;
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
        groups.set(k, new UnrolledList({ nodeSize: this.#nodeSize }));
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

    const getValueAt = (idx) => {
      const result = list.#nodeAt(idx);
      return result ? result.node.buffer[result.localIndex] : undefined;
    };

    return {
      next() {
        if (index < list.#size) {
          const value = getValueAt(index++);
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

  static fromArray(values, options = {}) {
    const list = new UnrolledList(options);
    for (const v of values) {
      list.append(v);
    }
    return list;
  }

  static fromIterator(iterator, options = {}) {
    const list = new UnrolledList(options);
    for (const value of iterator) {
      list.append(value);
    }
    return list;
  }

  static range(start, end, step = 1, options = {}) {
    const list = new UnrolledList(options);
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

  static merge(lists, options = {}) {
    const list = new UnrolledList(options);
    for (const source of lists) {
      for (const value of source) {
        list.append(value);
      }
    }
    return list;
  }
}

module.exports = { UnrolledList };
