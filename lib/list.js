'use strict';

const invertPair = (a, b) => ({ 0: b, 1: a });

class ListNode {
  constructor(size) {
    this.length = 0;
    this.size = size;
    this.readIndex = 0;
    this.writeIndex = 0;
    this.buffer = new Array(size);
    this.prev = null;
    this.next = null;
  }
}

class List {
  #length = 0;
  #nodeSize = 2048;
  #head = null;
  #tail = null;
  #cachedNode = null;
  #cachedNodeStart = 0;
  #skipPointers = [];
  #skipInterval = 8;
  #posResult = { node: null, offset: 0 };
  #uniformMiddle = true;
  #reversed = false;

  constructor(options = {}) {
    const { nodeSize } = options;
    if (nodeSize) this.#nodeSize = nodeSize;
    const node = new ListNode(this.#nodeSize);
    this.#head = node;
    this.#tail = node;
  }

  get size() {
    return this.#length;
  }

  #createNode() {
    return new ListNode(this.#nodeSize);
  }

  #normalizeIndex(index) {
    return index < 0 ? this.#length + index : index;
  }

  #setPositionResult(node, offset, cumulativeIndex) {
    this.#posResult.node = node;
    this.#posResult.offset = offset;
    this.#cachedNode = node;
    this.#cachedNodeStart = cumulativeIndex;
    return this.#posResult;
  }

  #tryFastPath(actualIndex) {
    if (actualIndex === 0) {
      return this.#setPositionResult(this.#head, this.#head.readIndex, 0);
    }
    if (actualIndex === this.#length - 1) {
      const offset = this.#tail.writeIndex - 1;
      const cumulativeIndex = this.#length - this.#tail.length;
      return this.#setPositionResult(this.#tail, offset, cumulativeIndex);
    }
    return null;
  }

  #tryUniformMiddle(actualIndex) {
    const hasMiddle = this.#head.next && this.#head.next !== this.#tail;
    if (!this.#uniformMiddle || !hasMiddle) return null;

    const headLength = this.#head.length;
    const tailLength = this.#tail.length;
    const inMiddle = actualIndex >= headLength;
    const beforeTail = actualIndex < this.#length - tailLength;

    if (!inMiddle || !beforeTail) return null;

    const middleIndex = actualIndex - headLength;
    const nodeNumber = Math.floor(middleIndex / this.#nodeSize) + 1;
    const offsetInNode = middleIndex % this.#nodeSize;

    if (this.#skipPointers.length === 0) return null;

    const skipIndex = Math.floor(nodeNumber / this.#skipInterval);
    if (skipIndex >= this.#skipPointers.length) return null;

    let node = this.#skipPointers[skipIndex].node;
    const startNodeNum = skipIndex * this.#skipInterval;
    const remaining = nodeNumber - startNodeNum;
    for (let i = 0; i < remaining; i++) node = node.next;

    const offset = node.readIndex + offsetInNode;
    const base = headLength + (nodeNumber - 1) * this.#nodeSize;
    return this.#setPositionResult(node, offset, base);
  }

  #tryCachedNode(actualIndex) {
    if (!this.#cachedNode) return null;
    const nodeStart = this.#cachedNodeStart;
    const nodeEnd = nodeStart + this.#cachedNode.length;
    if (actualIndex < nodeStart || actualIndex >= nodeEnd) return null;
    const offset = this.#cachedNode.readIndex + (actualIndex - nodeStart);
    this.#posResult.node = this.#cachedNode;
    this.#posResult.offset = offset;
    return this.#posResult;
  }

  #findBestStartPoint(actualIndex) {
    const distanceFromHead = actualIndex;
    const distanceFromTail = this.#length - 1 - actualIndex;
    let distanceFromCache = Infinity;

    if (this.#cachedNode) {
      distanceFromCache = Math.abs(actualIndex - this.#cachedNodeStart);
    }

    let node = null;
    let cumulativeIndex = 0;

    if (this.#skipPointers.length > 0) {
      let left = 0;
      let right = this.#skipPointers.length - 1;
      let bestIdx = 0;

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (this.#skipPointers[mid].cumulativeIndex <= actualIndex) {
          bestIdx = mid;
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }

      const skipEntry = this.#skipPointers[bestIdx];
      const distanceFromSkip = actualIndex - skipEntry.cumulativeIndex;

      if (
        distanceFromSkip < distanceFromHead &&
        distanceFromSkip < distanceFromTail &&
        distanceFromSkip < distanceFromCache
      ) {
        node = skipEntry.node;
        cumulativeIndex = skipEntry.cumulativeIndex;
      }
    }

    if (!node) {
      if (
        distanceFromCache < distanceFromHead &&
        distanceFromCache < distanceFromTail
      ) {
        node = this.#cachedNode;
        cumulativeIndex = this.#cachedNodeStart;
      } else if (distanceFromHead <= distanceFromTail) {
        node = this.#head;
        cumulativeIndex = 0;
      } else {
        node = this.#tail;
        cumulativeIndex = this.#length - node.length;
      }
    }

    return { node, cumulativeIndex };
  }

  #traverseToPosition(actualIndex, node, cumulativeIndex) {
    if (actualIndex < cumulativeIndex) {
      while (node) {
        const end = cumulativeIndex + node.length;
        if (actualIndex >= cumulativeIndex && actualIndex < end) {
          const offset = node.readIndex + (actualIndex - cumulativeIndex);
          return this.#setPositionResult(node, offset, cumulativeIndex);
        }
        cumulativeIndex -= node.length;
        node = node.prev;
      }
    } else {
      while (node) {
        const end = cumulativeIndex + node.length;
        if (actualIndex >= cumulativeIndex && actualIndex < end) {
          const offset = node.readIndex + (actualIndex - cumulativeIndex);
          return this.#setPositionResult(node, offset, cumulativeIndex);
        }
        cumulativeIndex += node.length;
        node = node.next;
      }
    }
    return null;
  }

  #findPosition(index) {
    if (index < 0 || index >= this.#length) return null;
    const actualIndex = this.#reversed ? this.#length - 1 - index : index;

    const fastPath = this.#tryFastPath(actualIndex);
    if (fastPath) return fastPath;

    const cachedResult = this.#tryCachedNode(actualIndex);
    if (cachedResult) return cachedResult;

    const middleResult = this.#tryUniformMiddle(actualIndex);
    if (middleResult) return middleResult;

    const { node, cumulativeIndex } = this.#findBestStartPoint(actualIndex);
    return this.#traverseToPosition(actualIndex, node, cumulativeIndex);
  }

  #rebuildSkipPointers() {
    this.#skipPointers = [];
    let node = this.#head;
    let cumulativeIndex = 0;
    let nodeCount = 0;

    while (node) {
      if (nodeCount % this.#skipInterval === 0) {
        this.#skipPointers.push({ node, cumulativeIndex });
      }
      cumulativeIndex += node.length;
      node = node.next;
      nodeCount++;
    }
  }

  #appendPhysical(value) {
    let node = this.#tail;
    if (node.writeIndex >= node.size) {
      const newNode = this.#createNode();
      node.next = newNode;
      newNode.prev = node;
      this.#tail = newNode;
      node = newNode;
      this.#skipPointers = [];
    }
    node.buffer[node.writeIndex++] = value;
    node.length++;
    this.#length++;
  }

  #prependPhysical(value) {
    const node = this.#head;
    if (node.readIndex > 0) {
      node.readIndex--;
      node.buffer[node.readIndex] = value;
      node.length++;
      this.#length++;
    } else {
      const newNode = this.#createNode();
      newNode.writeIndex = newNode.size;
      newNode.readIndex = newNode.size - 1;
      newNode.buffer[newNode.readIndex] = value;
      newNode.length = 1;
      newNode.next = node;
      node.prev = newNode;
      this.#head = newNode;
      this.#length++;
      this.#skipPointers = [];
      this.#uniformMiddle = false;
    }
  }

  #dequeueFromStart() {
    const node = this.#head;
    const value = node.buffer[node.readIndex];
    node.buffer[node.readIndex++] = undefined;
    node.length--;
    this.#length--;

    if (node.length === 0 && node.next) {
      if (this.#cachedNode === node) {
        this.#cachedNode = null;
        this.#cachedNodeStart = 0;
      }
      this.#head = node.next;
      this.#head.prev = null;
      this.#skipPointers = [];
      this.#uniformMiddle = false;
    }
    return value;
  }

  #dequeueFromEnd() {
    const node = this.#tail;
    const value = node.buffer[node.writeIndex - 1];
    node.buffer[--node.writeIndex] = undefined;
    node.length--;
    this.#length--;

    if (node.length === 0 && node.prev) {
      if (this.#cachedNode === node) {
        this.#cachedNode = null;
        this.#cachedNodeStart = 0;
      }
      this.#tail = node.prev;
      this.#tail.next = null;
      this.#skipPointers = [];
    }
    return value;
  }

  append(value) {
    if (this.#reversed) {
      this.#prependPhysical(value);
    } else {
      this.#appendPhysical(value);
    }
  }

  prepend(value) {
    if (this.#reversed) {
      this.#appendPhysical(value);
    } else {
      this.#prependPhysical(value);
    }
  }

  enqueue(value) {
    this.append(value);
  }

  dequeue() {
    let value = undefined;
    if (this.#length === 0) {
      return value;
    }
    if (this.#reversed) {
      value = this.#dequeueFromEnd();
    } else {
      value = this.#dequeueFromStart();
    }
    return value;
  }

  first() {
    let value = undefined;
    if (this.#length === 0) {
      return value;
    }
    if (this.#reversed) {
      value = this.#tail.buffer[this.#tail.writeIndex - 1];
    } else {
      value = this.#head.buffer[this.#head.readIndex];
    }
    return value;
  }

  last() {
    let value = undefined;
    if (this.#length === 0) {
      return value;
    }
    if (this.#reversed) {
      value = this.#head.buffer[this.#head.readIndex];
    } else {
      value = this.#tail.buffer[this.#tail.writeIndex - 1];
    }
    return value;
  }

  clear() {
    const node = this.#createNode();
    this.#head = node;
    this.#tail = node;
    this.#length = 0;
    this.#cachedNode = null;
    this.#cachedNodeStart = 0;
    this.#skipPointers = [];
    this.#uniformMiddle = true;
    this.#reversed = false;
  }

  *[Symbol.iterator]() {
    if (this.#reversed) {
      let node = this.#tail;
      while (node) {
        for (let i = node.writeIndex - 1; i >= node.readIndex; i--) {
          yield node.buffer[i];
        }
        node = node.prev;
      }
    } else {
      let node = this.#head;
      while (node) {
        for (let i = node.readIndex; i < node.writeIndex; i++) {
          yield node.buffer[i];
        }
        node = node.next;
      }
    }
  }

  async *[Symbol.asyncIterator]() {
    if (this.#reversed) {
      let node = this.#tail;
      while (node) {
        for (let i = node.writeIndex - 1; i >= node.readIndex; i--) {
          yield node.buffer[i];
        }
        node = node.prev;
      }
    } else {
      let node = this.#head;
      while (node) {
        for (let i = node.readIndex; i < node.writeIndex; i++) {
          yield node.buffer[i];
        }
        node = node.next;
      }
    }
  }

  toArray() {
    const array = new Array(this.#length);
    let index = 0;
    for (const value of this) {
      array[index++] = value;
    }
    return array;
  }

  static fromArray(arr, options = {}) {
    const list = new List(options);
    for (const value of arr) {
      list.append(value);
    }
    return list;
  }

  static fromIterator(iter, options = {}) {
    const list = new List(options);
    for (const value of iter) {
      list.append(value);
    }
    return list;
  }

  static range(start, end, step = 1) {
    const list = new List();
    if (step > 0) {
      for (let i = start; i < end; i += step) {
        list.append(i);
      }
    } else {
      for (let i = start; i > end; i += step) {
        list.append(i);
      }
    }
    return list;
  }

  static merge(lists) {
    if (lists.length === 0) return new List();
    const merged = new List();
    for (const list of lists) {
      for (const value of list) {
        merged.append(value);
      }
    }
    return merged;
  }

  at(index) {
    let value = undefined;
    const normalized = this.#normalizeIndex(index);
    const pos = this.#findPosition(normalized);
    if (!pos) {
      return value;
    }
    value = pos.node.buffer[pos.offset];
    return value;
  }

  set(index, value) {
    const normalized = this.#normalizeIndex(index);
    const pos = this.#findPosition(normalized);
    if (pos) {
      pos.node.buffer[pos.offset] = value;
    }
  }

  insert(index, value, count = 1) {
    if (count <= 0) return;
    if (index === 0) {
      for (let i = 0; i < count; i++) {
        this.prepend(value);
      }
      return;
    }
    if (index >= this.#length) {
      for (let i = 0; i < count; i++) {
        this.append(value);
      }
      return;
    }

    const arr = this.toArray();
    arr.splice(index, 0, ...new Array(count).fill(value));
    this.#rebuild(arr);
  }

  delete(index, count = 1) {
    if (count <= 0 || this.#length === 0) return;
    const arr = this.toArray();
    arr.splice(index, count);
    this.#rebuild(arr);
  }

  #rebuild(arr) {
    this.clear();
    this.addAll(arr);
    this.#rebuildSkipPointers();
    this.#uniformMiddle = true;
  }

  addAll(iterable) {
    for (const value of iterable) {
      this.append(value);
    }
  }

  removeAll(iterable) {
    const itemsToRemove = new Set(iterable);
    const arr = this.toArray().filter((v) => !itemsToRemove.has(v));
    this.#rebuild(arr);
  }

  fill(value, start, end) {
    const arr = this.toArray();
    arr.fill(value, start, end);
    this.#rebuild(arr);
  }

  replace(oldValue, newValue) {
    let node = this.#head;
    while (node) {
      for (let i = node.readIndex; i < node.writeIndex; i++) {
        if (node.buffer[i] === oldValue) {
          node.buffer[i] = newValue;
        }
      }
      node = node.next;
    }
  }

  includes(value) {
    for (const v of this) {
      if (v === value) return true;
    }
    return false;
  }

  indexOf(value) {
    let index = 0;
    for (const v of this) {
      if (v === value) return index;
      index++;
    }
    return -1;
  }

  lastIndexOf(value) {
    let lastIndex = -1;
    let index = 0;
    for (const v of this) {
      if (v === value) lastIndex = index;
      index++;
    }
    return lastIndex;
  }

  find(predicate) {
    let value = undefined;
    for (const v of this) {
      if (predicate(v)) {
        value = v;
        break;
      }
    }
    return value;
  }

  findIndex(predicate) {
    let index = 0;
    for (const v of this) {
      if (predicate(v)) return index;
      index++;
    }
    return -1;
  }

  some(predicate) {
    for (const v of this) {
      if (predicate(v)) return true;
    }
    return false;
  }

  every(predicate) {
    for (const v of this) {
      if (!predicate(v)) return false;
    }
    return true;
  }

  equals(other) {
    if (this.#length !== other.size) return false;
    const iter1 = this[Symbol.iterator]();
    const iter2 = other[Symbol.iterator]();
    for (let i = 0; i < this.#length; i++) {
      if (iter1.next().value !== iter2.next().value) return false;
    }
    return true;
  }

  clone() {
    const cloned = new List({ nodeSize: this.#nodeSize });
    for (const value of this) {
      cloned.append(value);
    }
    return cloned;
  }

  tail() {
    const result = new List({ nodeSize: this.#nodeSize });
    let first = true;
    for (const value of this) {
      if (first) {
        first = false;
        continue;
      }
      result.append(value);
    }
    return result;
  }

  head() {
    const result = new List({ nodeSize: this.#nodeSize });
    let count = 0;
    const limit = this.#length - 1;
    for (const value of this) {
      if (count < limit) {
        result.append(value);
      }
      count++;
    }
    return result;
  }

  take(n) {
    const result = new List({ nodeSize: this.#nodeSize });
    if (n >= 0) {
      let count = 0;
      for (const value of this) {
        if (count >= n) break;
        result.append(value);
        count++;
      }
    } else {
      const start = this.#length + n;
      let index = 0;
      for (const value of this) {
        if (index >= start) {
          result.append(value);
        }
        index++;
      }
    }
    return result;
  }

  slice(start, end) {
    const result = new List({ nodeSize: this.#nodeSize });
    let index = 0;
    for (const value of this) {
      if (index >= start && index < end) {
        result.append(value);
      }
      index++;
    }
    return result;
  }

  splitAt(index) {
    const before = new List({ nodeSize: this.#nodeSize });
    const after = new List({ nodeSize: this.#nodeSize });
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

  map(fn) {
    const result = new List({ nodeSize: this.#nodeSize });
    for (const value of this) {
      result.append(fn(value));
    }
    return result;
  }

  filter(predicate) {
    const result = new List({ nodeSize: this.#nodeSize });
    for (const value of this) {
      if (predicate(value)) {
        result.append(value);
      }
    }
    return result;
  }

  flatMap(fn) {
    const result = new List({ nodeSize: this.#nodeSize });
    for (const value of this) {
      const mapped = fn(value);
      if (Array.isArray(mapped)) {
        for (const item of mapped) {
          result.append(item);
        }
      } else if (mapped instanceof List) {
        for (const item of mapped) {
          result.append(item);
        }
      } else {
        result.append(mapped);
      }
    }
    return result;
  }

  groupBy(keyFn) {
    const groups = new Map();
    for (const value of this) {
      const key = keyFn(value);
      if (!groups.has(key)) {
        groups.set(key, new List({ nodeSize: this.#nodeSize }));
      }
      groups.get(key).append(value);
    }
    return groups;
  }

  reverse() {
    this.#reversed = !this.#reversed;
    this.#cachedNode = null;
    this.#cachedNodeStart = 0;
  }

  toReversed() {
    const cloned = this.clone();
    cloned.reverse();
    return cloned;
  }

  distinct() {
    const seen = new Set();
    const arr = [];
    for (const value of this) {
      if (!seen.has(value)) {
        seen.add(value);
        arr.push(value);
      }
    }
    this.#rebuild(arr);
  }

  toDistinct() {
    const cloned = this.clone();
    cloned.distinct();
    return cloned;
  }

  shuffle() {
    const arr = this.toArray();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const swapped = invertPair(arr[i], arr[j]);
      arr[i] = swapped[0];
      arr[j] = swapped[1];
    }
    this.#rebuild(arr);
  }

  toShuffled() {
    const cloned = this.clone();
    cloned.shuffle();
    return cloned;
  }

  drop(n) {
    if (n >= 0) {
      for (let i = 0; i < n && this.#length > 0; i++) {
        this.dequeue();
      }
    } else {
      const arr = this.toArray();
      arr.splice(arr.length + n);
      this.#rebuild(arr);
    }
  }

  rotateLeft(steps = 1) {
    if (this.#length === 0) return;
    steps %= this.#length;
    for (let i = 0; i < steps; i++) {
      const value = this.dequeue();
      this.append(value);
    }
  }

  rotateRight(steps = 1) {
    if (this.#length === 0) return;
    steps %= this.#length;
    for (let i = 0; i < steps; i++) {
      const value = this.last();
      const arr = this.toArray();
      arr.pop();
      this.#rebuild(arr);
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
    const normalizedI = this.#normalizeIndex(i);
    const normalizedJ = this.#normalizeIndex(j);
    const posI = this.#findPosition(normalizedI);
    if (!posI) return;
    const savedPosI = { node: posI.node, offset: posI.offset };
    const posJ = this.#findPosition(normalizedJ);
    if (posJ) {
      const temp = savedPosI.node.buffer[savedPosI.offset];
      savedPosI.node.buffer[savedPosI.offset] = posJ.node.buffer[posJ.offset];
      posJ.node.buffer[posJ.offset] = temp;
    }
  }

  move(from, to) {
    const arr = this.toArray();
    const [value] = arr.splice(from, 1);
    arr.splice(to, 0, value);
    this.#rebuild(arr);
  }

  sort(compare) {
    const arr = this.toArray();
    arr.sort(compare);
    this.#rebuild(arr);
  }

  toSorted(compare) {
    const cloned = this.clone();
    cloned.sort(compare);
    return cloned;
  }

  reduce(fn, initial) {
    let acc = initial;
    for (const value of this) {
      acc = fn(acc, value);
    }
    return acc;
  }

  sum(extractor) {
    let total = 0;
    for (const value of this) {
      total += extractor ? extractor(value) : value;
    }
    return total;
  }

  avg(extractor) {
    if (this.#length === 0) return 0;
    return this.sum(extractor) / this.#length;
  }

  min(compare) {
    let minValue = undefined;
    if (this.#length === 0) {
      return minValue;
    }
    minValue = this.first();
    for (const value of this) {
      if (compare) {
        if (compare(value, minValue) < 0) {
          minValue = value;
        }
      } else if (value < minValue) {
        minValue = value;
      }
    }
    return minValue;
  }

  max(compare) {
    let maxValue = undefined;
    if (this.#length === 0) {
      return maxValue;
    }
    maxValue = this.first();
    for (const value of this) {
      if (compare) {
        if (compare(value, maxValue) > 0) {
          maxValue = value;
        }
      } else if (value > maxValue) {
        maxValue = value;
      }
    }
    return maxValue;
  }

  *lazyMap(fn) {
    for (const value of this) {
      yield fn(value);
    }
  }

  *lazyFilter(predicate) {
    for (const value of this) {
      if (predicate(value)) {
        yield value;
      }
    }
  }

  *lazyReduce(fn, initial) {
    let acc = initial;
    for (const value of this) {
      acc = fn(acc, value);
      yield acc;
    }
  }

  join(separator = ',') {
    return this.toArray().join(separator);
  }
}

module.exports = { List };
