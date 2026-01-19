'use strict';

class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class List {
  #head = null;
  #tail = null;
  #size = 0;

  constructor(size = 0) {
    if (size > 0) {
      for (let i = 0; i < size; i++) {
        this.append(undefined);
      }
    }
  }

  get size() {
    return this.#size;
  }

  static fromArray(values) {
    const list = new List();
    for (const value of values) {
      list.append(value);
    }
    return list;
  }

  static fromIterator(iterator) {
    const list = new List();
    let result = iterator.next();
    while (!result.done) {
      list.append(result.value);
      result = iterator.next();
    }
    return list;
  }

  static range(start, end, step) {
    const list = new List();
    if (step === undefined) {
      step = start <= end ? 1 : -1;
    }
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
    const result = new List();
    for (const list of lists) {
      for (const value of list) {
        result.append(value);
      }
    }
    return result;
  }

  append(value) {
    const node = new ListNode(value);
    if (this.#tail === null) {
      this.#head = node;
      this.#tail = node;
    } else {
      node.prev = this.#tail;
      this.#tail.next = node;
      this.#tail = node;
    }
    this.#size++;
  }

  prepend(value) {
    const node = new ListNode(value);
    if (this.#head === null) {
      this.#head = node;
      this.#tail = node;
    } else {
      node.next = this.#head;
      this.#head.prev = node;
      this.#head = node;
    }
    this.#size++;
  }

  clear() {
    this.#head = null;
    this.#tail = null;
    this.#size = 0;
  }

  enqueue(value) {
    this.append(value);
  }

  /* eslint-disable consistent-return */
  dequeue() {
    if (this.#head === null) return undefined;
    const value = this.#head.value;
    this.#head = this.#head.next;
    if (this.#head === null) {
      this.#tail = null;
    } else {
      this.#head.prev = null;
    }
    this.#size--;
    return value;
  }
  /* eslint-enable consistent-return */

  first() {
    return this.#head?.value;
  }

  last() {
    return this.#tail?.value;
  }

  at(index) {
    const node = this.#nodeAt(index);
    return node?.value;
  }

  set(index, value) {
    const node = this.#nodeAt(index);
    if (node !== null) {
      node.value = value;
    }
  }

  #normalizeIndex(index) {
    return index < 0 ? this.#size + index : index;
  }

  #nodeAt(index) {
    if (this.#size === 0) return null;

    index = this.#normalizeIndex(index);

    if (index < 0 || index >= this.#size) {
      return null;
    }

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

  insert(index, value, count = 1) {
    index = this.#normalizeIndex(index);

    if (index < 0) index = 0;
    if (index > this.#size) index = this.#size;

    for (let i = 0; i < count; i++) {
      if (index === 0) {
        this.prepend(value);
      } else if (index >= this.#size) {
        this.append(value);
      } else {
        const node = this.#nodeAt(index);
        const newNode = new ListNode(value);
        newNode.next = node;
        newNode.prev = node.prev;
        node.prev.next = newNode;
        node.prev = newNode;
        this.#size++;
      }
      index++;
    }
  }

  delete(index, count = 1) {
    index = this.#normalizeIndex(index);

    if (index < 0 || index >= this.#size) {
      return;
    }

    count = Math.min(count, this.#size - index);

    for (let i = 0; i < count; i++) {
      const node = this.#nodeAt(index);
      if (node === null) break;

      if (node.prev === null) {
        this.#head = node.next;
      } else {
        node.prev.next = node.next;
      }

      if (node.next === null) {
        this.#tail = node.prev;
      } else {
        node.next.prev = node.prev;
      }

      this.#size--;
    }
  }

  addAll(values) {
    for (const value of values) {
      this.append(value);
    }
  }

  removeAll(values) {
    const toRemove = new Set(values);
    let node = this.#head;
    while (node !== null) {
      const next = node.next;
      if (toRemove.has(node.value)) {
        if (node.prev === null) {
          this.#head = node.next;
        } else {
          node.prev.next = node.next;
        }
        if (node.next === null) {
          this.#tail = node.prev;
        } else {
          node.next.prev = node.prev;
        }
        this.#size--;
      }
      node = next;
    }
  }

  fill(value, start = 0, end = this.#size) {
    start = this.#normalizeIndex(start);
    end = this.#normalizeIndex(end);
    if (start < 0) start = 0;
    if (end > this.#size) end = this.#size;

    let node = this.#nodeAt(start);
    for (let i = start; i < end && node !== null; i++) {
      node.value = value;
      node = node.next;
    }
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

  tail() {
    return this.slice(1);
  }

  head() {
    return this.slice(0, -1);
  }

  drop(n) {
    if (n === 0) return;

    if (n > 0) {
      n = Math.min(n, this.#size);
      for (let i = 0; i < n; i++) {
        this.dequeue();
      }
    } else {
      n = Math.min(-n, this.#size);
      for (let i = 0; i < n; i++) {
        if (this.#tail !== null) {
          this.#tail = this.#tail.prev;
          if (this.#tail === null) {
            this.#head = null;
          } else {
            this.#tail.next = null;
          }
          this.#size--;
        }
      }
    }
  }

  take(n) {
    if (n >= 0) {
      return this.slice(0, n);
    } else {
      return this.slice(n);
    }
  }

  slice(start = 0, end = this.#size) {
    const list = new List();

    start = this.#normalizeIndex(start);
    end = this.#normalizeIndex(end);
    if (start < 0) start = 0;
    if (end > this.#size) end = this.#size;
    if (start >= end) return list;

    let node = this.#nodeAt(start);
    for (let i = start; i < end && node !== null; i++) {
      list.append(node.value);
      node = node.next;
    }

    return list;
  }

  splitAt(index) {
    return {
      before: this.slice(0, index),
      after: this.slice(index),
    };
  }

  groupBy(keyFn) {
    const groups = new Map();
    for (const value of this) {
      const key = keyFn(value);
      if (!groups.has(key)) {
        groups.set(key, new List());
      }
      groups.get(key).append(value);
    }
    return groups;
  }

  rotateLeft(steps = 1) {
    if (this.#size <= 1) return;
    steps %= this.#size;
    if (steps < 0) steps += this.#size;

    for (let i = 0; i < steps; i++) {
      const value = this.dequeue();
      this.append(value);
    }
  }

  rotateRight(steps = 1) {
    if (this.#size <= 1) return;
    steps %= this.#size;
    if (steps < 0) steps += this.#size;

    for (let i = 0; i < steps; i++) {
      const value = this.#tail.value;
      this.drop(-1);
      this.prepend(value);
    }
  }

  rotate(n) {
    if (n >= 0) {
      this.rotateRight(n);
    } else {
      this.rotateLeft(-n);
    }
  }

  swap(i, j) {
    if (i === j) return;

    const nodeI = this.#nodeAt(i);
    const nodeJ = this.#nodeAt(j);

    if (nodeI === null || nodeJ === null) return;

    const temp = nodeI.value;
    nodeI.value = nodeJ.value;
    nodeJ.value = temp;
  }

  move(from, to) {
    if (from === to) return;

    from = this.#normalizeIndex(from);
    to = this.#normalizeIndex(to);

    if (from < 0 || from >= this.#size || to < 0 || to >= this.#size) return;

    const value = this.at(from);
    this.delete(from);
    this.insert(to, value);
  }

  includes(value) {
    return this.indexOf(value) !== -1;
  }

  indexOf(value) {
    let index = 0;
    let node = this.#head;
    while (node !== null) {
      if (node.value === value) {
        return index;
      }
      node = node.next;
      index++;
    }
    return -1;
  }

  lastIndexOf(value) {
    let index = this.#size - 1;
    let node = this.#tail;
    while (node !== null) {
      if (node.value === value) {
        return index;
      }
      node = node.prev;
      index--;
    }
    return -1;
  }

  equals(other) {
    if (this.#size !== other.size) return false;

    let nodeA = this.#head;
    let nodeB = other.#head;

    while (nodeA !== null) {
      if (nodeA.value !== nodeB.value) {
        return false;
      }
      nodeA = nodeA.next;
      nodeB = nodeB.next;
    }

    return true;
  }

  /* eslint-disable consistent-return */
  find(predicate) {
    let index = 0;
    for (let node = this.#head; node !== null; node = node.next) {
      if (predicate(node.value, index)) return node.value;
      index++;
    }
    return undefined;
  }
  /* eslint-enable consistent-return */

  findIndex(predicate) {
    let index = 0;
    let node = this.#head;
    while (node !== null) {
      if (predicate(node.value, index)) {
        return index;
      }
      node = node.next;
      index++;
    }
    return -1;
  }

  some(predicate) {
    let index = 0;
    let node = this.#head;
    while (node !== null) {
      if (predicate(node.value, index)) {
        return true;
      }
      node = node.next;
      index++;
    }
    return false;
  }

  every(predicate) {
    let index = 0;
    let node = this.#head;
    while (node !== null) {
      if (!predicate(node.value, index)) {
        return false;
      }
      node = node.next;
      index++;
    }
    return true;
  }

  distinct() {
    const seen = new Set();
    let node = this.#head;
    while (node !== null) {
      const next = node.next;
      if (seen.has(node.value)) {
        if (node.prev === null) {
          this.#head = node.next;
        } else {
          node.prev.next = node.next;
        }
        if (node.next === null) {
          this.#tail = node.prev;
        } else {
          node.next.prev = node.prev;
        }
        this.#size--;
      } else {
        seen.add(node.value);
      }
      node = next;
    }
  }

  toDistinct() {
    const result = this.clone();
    result.distinct();
    return result;
  }

  shuffle() {
    if (this.#size <= 1) return;

    const array = this.toArray();
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    this.clear();
    for (const value of array) {
      this.append(value);
    }
  }

  toShuffled() {
    const result = this.clone();
    result.shuffle();
    return result;
  }

  reverse() {
    if (this.#size <= 1) return;

    let current = this.#head;
    let temp = null;

    while (current !== null) {
      temp = current.prev;
      current.prev = current.next;
      current.next = temp;
      current = current.prev;
    }

    temp = this.#head;
    this.#head = this.#tail;
    this.#tail = temp;
  }

  toReversed() {
    const result = this.clone();
    result.reverse();
    return result;
  }

  sort(compare) {
    if (this.#size <= 1) return;

    if (!compare) {
      compare = (a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      };
    }

    this.#head = this.#mergeSort(this.#head, compare);

    let node = this.#head;
    while (node.next !== null) {
      node = node.next;
    }
    this.#tail = node;
  }

  toSorted(compare) {
    const result = this.clone();
    result.sort(compare);
    return result;
  }

  #mergeSort(head, compare) {
    if (head === null || head.next === null) {
      return head;
    }

    const middle = this.#getMiddle(head);
    const nextOfMiddle = middle.next;
    middle.next = null;
    if (nextOfMiddle !== null) {
      nextOfMiddle.prev = null;
    }

    const left = this.#mergeSort(head, compare);
    const right = this.#mergeSort(nextOfMiddle, compare);

    return this.#mergeLists(left, right, compare);
  }

  // eslint-disable-next-line class-methods-use-this
  #getMiddle = (head) => {
    if (head === null) return head;
    let slow = head;
    let fast = head;
    while (fast.next !== null && fast.next.next !== null) {
      slow = slow.next;
      fast = fast.next.next;
    }
    return slow;
  };

  #mergeLists(left, right, compare) {
    if (left === null) return right;
    if (right === null) return left;

    let result;
    if (compare(left.value, right.value) <= 0) {
      result = left;
      result.next = this.#mergeLists(left.next, right, compare);
    } else {
      result = right;
      result.next = this.#mergeLists(left, right.next, compare);
    }

    if (result.next !== null) {
      result.next.prev = result;
    }
    result.prev = null;

    return result;
  }

  map(fn) {
    const list = new List();
    let index = 0;
    let node = this.#head;
    while (node !== null) {
      list.append(fn(node.value, index));
      node = node.next;
      index++;
    }
    return list;
  }

  *lazyMap(fn) {
    let index = 0;
    let node = this.#head;
    while (node !== null) {
      yield fn(node.value, index);
      node = node.next;
      index++;
    }
  }

  flatMap(fn) {
    const list = new List();
    for (const value of this) {
      const mapped = fn(value);
      for (const item of mapped) {
        list.append(item);
      }
    }
    return list;
  }

  filter(predicate) {
    const list = new List();
    let index = 0;
    let node = this.#head;
    while (node !== null) {
      if (predicate(node.value, index)) {
        list.append(node.value);
      }
      node = node.next;
      index++;
    }
    return list;
  }

  *lazyFilter(predicate) {
    let index = 0;
    let node = this.#head;
    while (node !== null) {
      if (predicate(node.value, index)) {
        yield node.value;
      }
      node = node.next;
      index++;
    }
  }

  reduce(fn, initial) {
    let acc = initial;
    let index = 0;
    let node = this.#head;
    while (node !== null) {
      acc = fn(acc, node.value, index);
      node = node.next;
      index++;
    }
    return acc;
  }

  *lazyReduce(fn, initial) {
    let acc = initial;
    let index = 0;
    let node = this.#head;
    while (node !== null) {
      acc = fn(acc, node.value, index);
      yield acc;
      node = node.next;
      index++;
    }
  }

  sum(fn) {
    let total = 0;
    for (const value of this) {
      total += fn ? fn(value) : value;
    }
    return total;
  }

  avg(fn) {
    if (this.#size === 0) return NaN;
    return this.sum(fn) / this.#size;
  }

  /* eslint-disable consistent-return */
  min(compare) {
    if (this.#size === 0) return undefined;
    if (!compare) {
      compare = (a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      };
    }
    let min = this.#head.value;
    for (let node = this.#head.next; node !== null; node = node.next) {
      if (compare(node.value, min) < 0) min = node.value;
    }
    return min;
  }

  max(compare) {
    if (this.#size === 0) return undefined;
    if (!compare) {
      compare = (a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      };
    }
    let max = this.#head.value;
    for (let node = this.#head.next; node !== null; node = node.next) {
      if (compare(node.value, max) > 0) max = node.value;
    }
    return max;
  }
  /* eslint-enable consistent-return */

  *[Symbol.iterator]() {
    let node = this.#head;
    while (node !== null) {
      yield node.value;
      node = node.next;
    }
  }

  async *[Symbol.asyncIterator]() {
    let node = this.#head;
    while (node !== null) {
      yield node.value;
      node = node.next;
    }
  }

  toArray() {
    const array = [];
    let node = this.#head;
    while (node !== null) {
      array.push(node.value);
      node = node.next;
    }
    return array;
  }

  join(separator = ',') {
    return this.toArray().join(separator);
  }

  clone() {
    return List.fromArray(this.toArray());
  }
}

module.exports = { List };
