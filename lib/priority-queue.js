'use strict';

const HEAP = Symbol('heap');

const shared = {
  [HEAP]: [],
  peek() {
    return this[HEAP][0];
  },
  isEmpty() {
    return this[HEAP].length === 0;
  },
  includes(value) {
    return this[HEAP].includes(value);
  },
  clear() {
    this[HEAP] = [];
  },
  toArray() {
    return this[HEAP].slice();
  },
  *[Symbol.iterator]() {
    const heap = this[HEAP];
    for (let i = 0; i < heap.length; i++) yield heap[i];
  },
};

class MinPriorityQueue {
  [HEAP] = [];

  get size() {
    return this[HEAP].length;
  }

  static fromArray(values) {
    const heap = new MinPriorityQueue();
    heap[HEAP] = [...values];
    const length = heap[HEAP].length;
    for (let i = (length >> 1) - 1; i >= 0; i--) heap.#siftDown(i);
    return heap;
  }

  push(value = undefined) {
    const heap = this[HEAP];
    const index = heap.length;
    heap.push(value);
    let i = index;
    while (i > 0) {
      const parent = (i - 1) >> 2;
      if (heap[parent] <= value) break;
      heap[i] = heap[parent];
      i = parent;
    }
    heap[i] = value;
  }

  pop() {
    const heap = this[HEAP];
    const top = heap[0];
    if (heap.length === 0) return top;
    const last = heap.pop();
    if (heap.length === 0) return top;
    let index = 0;
    const size = heap.length;
    for (;;) {
      const base = (index << 2) + 1;
      if (base >= size) break;
      let selected = base;
      if (base + 1 < size && heap[base + 1] < heap[selected]) {
        selected = base + 1;
      }
      if (base + 2 < size && heap[base + 2] < heap[selected]) {
        selected = base + 2;
      }
      if (base + 3 < size && heap[base + 3] < heap[selected]) {
        selected = base + 3;
      }
      if (heap[selected] >= last) break;
      heap[index] = heap[selected];
      index = selected;
    }
    heap[index] = last;
    return top;
  }

  #siftDown(start) {
    const heap = this[HEAP];
    const size = heap.length;
    let i = start;
    const item = heap[i];
    for (;;) {
      const base = (i << 2) + 1;
      if (base >= size) break;
      let selected = base;
      if (base + 1 < size && heap[base + 1] < heap[selected]) {
        selected = base + 1;
      }
      if (base + 2 < size && heap[base + 2] < heap[selected]) {
        selected = base + 2;
      }
      if (base + 3 < size && heap[base + 3] < heap[selected]) {
        selected = base + 3;
      }
      if (heap[selected] >= item) break;
      heap[i] = heap[selected];
      i = selected;
    }
    heap[i] = item;
  }
}

Object.assign(MinPriorityQueue.prototype, shared);

class MaxPriorityQueue {
  [HEAP] = [];

  get size() {
    return this[HEAP].length;
  }

  static fromArray(values) {
    const heap = new MaxPriorityQueue();
    heap[HEAP] = [...values];
    const length = heap[HEAP].length;
    for (let i = (length >> 1) - 1; i >= 0; i--) heap.#siftDown(i);
    return heap;
  }

  push(value = undefined) {
    const heap = this[HEAP];
    const index = heap.length;
    heap.push(value);
    let i = index;
    while (i > 0) {
      const parent = (i - 1) >> 2;
      if (heap[parent] >= value) break;
      heap[i] = heap[parent];
      i = parent;
    }
    heap[i] = value;
  }

  pop() {
    const heap = this[HEAP];
    const top = heap[0];
    if (heap.length === 0) return top;
    const last = heap.pop();
    if (heap.length === 0) return top;
    let index = 0;
    const size = heap.length;
    for (;;) {
      const base = (index << 2) + 1;
      if (base >= size) break;
      let selected = base;
      if (base + 1 < size && heap[base + 1] > heap[selected]) {
        selected = base + 1;
      }
      if (base + 2 < size && heap[base + 2] > heap[selected]) {
        selected = base + 2;
      }
      if (base + 3 < size && heap[base + 3] > heap[selected]) {
        selected = base + 3;
      }
      if (heap[selected] <= last) break;
      heap[index] = heap[selected];
      index = selected;
    }
    heap[index] = last;
    return top;
  }

  #siftDown(start) {
    const heap = this[HEAP];
    const size = heap.length;
    let i = start;
    const item = heap[i];
    for (;;) {
      const base = (i << 2) + 1;
      if (base >= size) break;
      let selected = base;
      if (base + 1 < size && heap[base + 1] > heap[selected]) {
        selected = base + 1;
      }
      if (base + 2 < size && heap[base + 2] > heap[selected]) {
        selected = base + 2;
      }
      if (base + 3 < size && heap[base + 3] > heap[selected]) {
        selected = base + 3;
      }
      if (heap[selected] <= item) break;
      heap[i] = heap[selected];
      i = selected;
    }
    heap[i] = item;
  }
}

Object.assign(MaxPriorityQueue.prototype, shared);

class CmpPriorityQueue {
  [HEAP] = [];
  #compare;

  constructor(compare) {
    this.#compare = compare;
  }

  get size() {
    return this[HEAP].length;
  }

  static fromArray(values, compare) {
    const heap = new CmpPriorityQueue(compare);
    heap[HEAP] = [...values];
    const length = heap[HEAP].length;
    for (let i = (length >> 1) - 1; i >= 0; i--) heap.#siftDown(i);
    return heap;
  }

  push(value = undefined) {
    const heap = this[HEAP];
    const index = heap.length;
    heap.push(value);
    let i = index;
    const compare = this.#compare;
    while (i > 0) {
      const parent = (i - 1) >> 2;
      if (compare(heap[parent], heap[i]) <= 0) break;
      const tmp = heap[parent];
      heap[parent] = heap[i];
      heap[i] = tmp;
      i = parent;
    }
  }

  pop() {
    const heap = this[HEAP];
    const top = heap[0];
    if (heap.length === 0) return top;
    const last = heap.pop();
    if (heap.length === 0) return top;
    heap[0] = last;
    let index = 0;
    const size = heap.length;
    const compare = this.#compare;
    for (;;) {
      let selected = index;
      const base = (index << 2) + 1;
      if (base >= size) break;
      const end = base + 4 < size ? base + 4 : size;
      for (let child = base; child < end; child++) {
        if (compare(heap[child], heap[selected]) < 0) selected = child;
      }
      if (selected === index) break;
      const tmp = heap[index];
      heap[index] = heap[selected];
      heap[selected] = tmp;
      index = selected;
    }
    return top;
  }

  #siftDown(start) {
    const heap = this[HEAP];
    const size = heap.length;
    let i = start;
    const compare = this.#compare;
    for (;;) {
      let selected = i;
      const base = (i << 2) + 1;
      if (base >= size) break;
      const end = base + 4 < size ? base + 4 : size;
      for (let child = base; child < end; child++) {
        if (compare(heap[child], heap[selected]) < 0) selected = child;
      }
      if (selected === i) break;
      const tmp = heap[i];
      heap[i] = heap[selected];
      heap[selected] = tmp;
      i = selected;
    }
  }
}

Object.assign(CmpPriorityQueue.prototype, shared);

class PriorityQueue {
  constructor(options = {}) {
    if (typeof options.compare === 'function') {
      return new CmpPriorityQueue(options.compare);
    }
    if (options.kind === 'max') {
      return new MaxPriorityQueue();
    }
    return new MinPriorityQueue();
  }

  static fromArray(values, options = {}) {
    if (typeof options.compare === 'function') {
      return CmpPriorityQueue.fromArray(values, options.compare);
    }
    if (options.kind === 'max') {
      return MaxPriorityQueue.fromArray(values);
    }
    return MinPriorityQueue.fromArray(values);
  }
}

module.exports = { PriorityQueue };
