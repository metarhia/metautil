'use strict';

class List {
  #data;
  #asyncQueue = [];
  #asyncIndex = 0;

  constructor(size = 0) {
    this.#data = Array.from({ length: size });
    this.#data.length = 0;
  }

  get size() {
    return this.#data.length;
  }

  [Symbol.iterator]() {
    return this.#data[Symbol.iterator]();
  }

  toArray() {
    return [...this.#data];
  }

  clone() {
    const list = new List();
    list.#data = [...this.#data];
    return list;
  }

  clear() {
    this.#data.length = 0;
  }

  at(index) {
    return this.#data.at(index);
  }

  set(index, value) {
    const i = index < 0 ? this.#data.length + index : index;
    if (i >= 0 && i < this.#data.length) {
      this.#data[i] = value;
    }
  }

  first() {
    return this.#data[0];
  }

  last() {
    return this.#data[this.#data.length - 1];
  }

  append(value) {
    this.#data.push(value);
    this.#resolveNextAsync();
  }

  #resolveNextAsync() {
    if (this.#asyncQueue.length > 0 && this.#asyncIndex < this.#data.length) {
      const { resolve } = this.#asyncQueue.shift();
      resolve({ value: this.#data[this.#asyncIndex++], done: false });
    }
  }

  prepend(value) {
    this.#data.unshift(value);
  }

  insert(index, value, count = 1) {
    const values = Array.from({ length: count }, () => value);
    this.#data.splice(index, 0, ...values);
  }

  delete(index, count = 1) {
    this.#data.splice(index, count);
  }

  enqueue(value) {
    this.#data.push(value);
  }

  dequeue() {
    return this.#data.shift();
  }

  slice(start, end) {
    const list = new List();
    list.#data = this.#data.slice(start, end);
    return list;
  }

  head() {
    const list = new List();
    list.#data = this.#data.slice(0, -1);
    return list;
  }

  tail() {
    const list = new List();
    list.#data = this.#data.slice(1);
    return list;
  }

  take(n) {
    const list = new List();
    if (n >= 0) {
      list.#data = this.#data.slice(0, n);
    } else {
      list.#data = this.#data.slice(n);
    }
    return list;
  }

  drop(n) {
    if (n >= 0) {
      this.#data.splice(0, n);
    } else {
      this.#data.splice(n);
    }
  }

  splitAt(index) {
    const before = new List();
    const after = new List();
    before.#data = this.#data.slice(0, index);
    after.#data = this.#data.slice(index);
    return { before, after };
  }

  includes(value) {
    return this.#data.includes(value);
  }

  indexOf(value) {
    return this.#data.indexOf(value);
  }

  lastIndexOf(value) {
    return this.#data.lastIndexOf(value);
  }

  find(fn) {
    return this.#data.find(fn);
  }

  findIndex(fn) {
    return this.#data.findIndex(fn);
  }

  equals(other) {
    if (this.#data.length !== other.size) return false;
    let i = 0;
    for (const value of other) {
      if (this.#data[i++] !== value) return false;
    }
    return true;
  }

  addAll(values) {
    for (const value of values) {
      this.#data.push(value);
    }
  }

  removeAll(values) {
    const toRemove = new Set(values);
    this.#data = this.#data.filter((v) => !toRemove.has(v));
  }

  fill(value, start = 0, end = this.#data.length) {
    this.#data.fill(value, start, end);
  }

  replace(oldValue, newValue) {
    const index = this.#data.indexOf(oldValue);
    if (index !== -1) {
      this.#data[index] = newValue;
    }
  }

  swap(i, j) {
    const a = i < 0 ? this.#data.length + i : i;
    const b = j < 0 ? this.#data.length + j : j;
    [this.#data[a], this.#data[b]] = [this.#data[b], this.#data[a]];
  }

  move(from, to) {
    const [item] = this.#data.splice(from, 1);
    this.#data.splice(to, 0, item);
  }

  rotate(n) {
    if (this.#data.length === 0) return;
    const len = this.#data.length;
    const shift = ((n % len) + len) % len;
    if (shift === 0) return;
    this.#data = [...this.#data.slice(-shift), ...this.#data.slice(0, -shift)];
  }

  rotateLeft(steps = 1) {
    this.rotate(-steps);
  }

  rotateRight(steps = 1) {
    this.rotate(steps);
  }

  reverse() {
    this.#data.reverse();
  }

  toReversed() {
    const list = new List();
    list.#data = this.#data.toReversed();
    return list;
  }

  sort(compare) {
    this.#data.sort(compare);
  }

  toSorted(compare) {
    const list = new List();
    list.#data = this.#data.toSorted(compare);
    return list;
  }

  shuffle(random = Math.random) {
    for (let i = this.#data.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [this.#data[i], this.#data[j]] = [this.#data[j], this.#data[i]];
    }
  }

  toShuffled(random = Math.random) {
    const list = this.clone();
    list.shuffle(random);
    return list;
  }

  distinct() {
    this.#data = [...new Set(this.#data)];
  }

  toDistinct() {
    const list = new List();
    list.#data = [...new Set(this.#data)];
    return list;
  }

  map(fn) {
    const list = new List();
    list.#data = this.#data.map(fn);
    return list;
  }

  flatMap(fn) {
    const list = new List();
    for (let i = 0; i < this.#data.length; i++) {
      const result = fn(this.#data[i]);
      if (result[Symbol.iterator]) {
        for (const item of result) {
          list.#data.push(item);
        }
      } else {
        list.#data.push(result);
      }
    }
    return list;
  }

  filter(fn) {
    const list = new List();
    list.#data = this.#data.filter(fn);
    return list;
  }

  reduce(fn, initial) {
    return this.#data.reduce(fn, initial);
  }

  some(fn) {
    return this.#data.some(fn);
  }

  every(fn) {
    return this.#data.every(fn);
  }

  sum(fn) {
    if (this.#data.length === 0) return 0;
    if (fn) {
      return this.#data.reduce((acc, v) => acc + fn(v), 0);
    }
    return this.#data.reduce((acc, v) => acc + v, 0);
  }

  avg(fn) {
    if (this.#data.length === 0) return NaN;
    return this.sum(fn) / this.#data.length;
  }

  min(compare) {
    const data = this.#data;
    if (data.length === 0) return data[0];
    if (compare) return data.reduce((a, b) => (compare(a, b) <= 0 ? a : b));
    return Math.min(...data);
  }

  max(compare) {
    const data = this.#data;
    if (data.length === 0) return data[0];
    if (compare) return data.reduce((a, b) => (compare(a, b) >= 0 ? a : b));
    return Math.max(...data);
  }

  groupBy(key) {
    const groups = new Map();
    for (const value of this.#data) {
      const k = key(value);
      if (!groups.has(k)) {
        groups.set(k, new List());
      }
      groups.get(k).append(value);
    }
    return groups;
  }

  // Phase 12: Lazy Iterators

  *lazyMap(fn) {
    for (let i = 0; i < this.#data.length; i++) {
      yield fn(this.#data[i], i);
    }
  }

  *lazyFilter(fn) {
    for (let i = 0; i < this.#data.length; i++) {
      if (fn(this.#data[i], i)) {
        yield this.#data[i];
      }
    }
  }

  *lazyReduce(fn, initial) {
    let acc = initial;
    for (let i = 0; i < this.#data.length; i++) {
      acc = fn(acc, this.#data[i], i);
      yield acc;
    }
  }

  join(separator = ',') {
    return this.#data.join(separator);
  }

  [Symbol.asyncIterator]() {
    const list = this;
    let index = this.#asyncIndex;

    return {
      next() {
        if (index < list.#data.length) {
          return Promise.resolve({
            value: list.#data[index++],
            done: false,
          });
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
    const list = new List(values.length);
    list.#data = [...values];
    return list;
  }

  static fromIterator(iterator) {
    const list = new List();
    for (const value of iterator) {
      list.#data.push(value);
    }
    return list;
  }

  static range(start, end, step = 1) {
    const list = new List();
    if (step > 0) {
      for (let i = start; i < end; i += step) {
        list.#data.push(i);
      }
    } else if (step < 0) {
      for (let i = start; i > end; i += step) {
        list.#data.push(i);
      }
    }
    return list;
  }

  static merge(lists) {
    const list = new List();
    for (const source of lists) {
      for (const value of source) {
        list.#data.push(value);
      }
    }
    return list;
  }
}

module.exports = { List };
