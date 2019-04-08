/* eslint-disable no-use-before-define */

'use strict';

const toIterator = base => {
  if (!base[Symbol.iterator]) {
    throw new TypeError('Base is not Iterable');
  }
  return base[Symbol.iterator]();
};

class Iterator {
  constructor(base) {
    this.base = toIterator(base);
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
    return this.base.next();
  }

  count() {
    let count = 0;
    while (!this.next().done) {
      count++;
    }
    return count;
  }

  each(fn, thisArg) {
    this.forEach(fn, thisArg);
  }

  forEach(fn, thisArg) {
    for (const value of this) {
      fn.call(thisArg, value);
    }
  }

  every(predicate, thisArg) {
    for (const value of this) {
      if (!predicate.call(thisArg, value)) {
        return false;
      }
    }
    return true;
  }

  find(predicate, thisArg) {
    for (const value of this) {
      if (predicate.call(thisArg, value)) {
        return value;
      }
    }
    return undefined;
  }

  includes(element) {
    for (const value of this) {
      if (value === element || (Number.isNaN(value) && Number.isNaN(element))) {
        return true;
      }
    }
    return false;
  }

  reduce(reducer, initialValue) {
    let result = initialValue;

    if (result === undefined) {
      const next = this.next();
      if (next.done) {
        throw new TypeError(
          'Reduce of consumed iterator with no initial value'
        );
      }
      result = next.value;
    }

    for (const value of this) {
      result = reducer(result, value);
    }
    return result;
  }

  some(predicate, thisArg) {
    for (const value of this) {
      if (predicate.call(thisArg, value)) {
        return true;
      }
    }
    return false;
  }

  someCount(predicate, count, thisArg) {
    let n = 0;
    for (const value of this) {
      if (predicate.call(thisArg, value)) {
        if (++n === count) return true;
      }
    }
    return false;
  }

  collectTo(CollectionClass) {
    return new CollectionClass(this);
  }

  collectWith(obj, collector) {
    this.forEach(element => collector(obj, element));
  }

  toArray() {
    return Array.from(this);
  }

  map(mapper, thisArg) {
    return new MapIterator(this, mapper, thisArg);
  }

  filter(predicate, thisArg) {
    return new FilterIterator(this, predicate, thisArg);
  }

  flat(depth = 1) {
    return new FlatIterator(this, depth);
  }

  flatMap(mapper, thisArg) {
    return new FlatMapIterator(this, mapper, thisArg);
  }

  zip(...iterators) {
    return new ZipIterator(this, iterators);
  }

  chain(...iterators) {
    return new ChainIterator(this, iterators);
  }

  take(amount) {
    return new TakeIterator(this, amount);
  }

  takeWhile(predicate, thisArg) {
    return new TakeWhileIterator(this, predicate, thisArg);
  }

  skip(amount) {
    for (let i = 0; i < amount; i++) {
      this.next();
    }
    return this;
  }

  enumerate() {
    return new EnumerateIterator(this);
  }

  join(sep = ',', prefix = '', suffix = '') {
    let result = prefix;
    const { done, value } = this.next();
    if (!done) {
      result += value;
      for (const value of this) {
        result += sep + value;
      }
    }
    return result + suffix;
  }

  // Create iterator iterating over the range
  // Signature: start, stop[, step]
  //   start <number>
  //   stop <number>
  //   step <number> (optional), default: `1`
  //
  // Returns: <Iterator>
  static range(start, stop, step) {
    return new Iterator(rangeGenerator(start, stop, step));
  }
}

Object.defineProperty(Iterator.prototype, Symbol.toStringTag, {
  value: 'Metarhia Iterator',
  writable: false,
  enumerable: false,
  configurable: true,
});

function* rangeGenerator(start, stop, step = 1) {
  if (stop === undefined) {
    stop = start;
    start = 0;
  }

  while (true) {
    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
      return;
    }
    yield start;
    start += step;
  }
}

class MapIterator extends Iterator {
  constructor(base, mapper, thisArg) {
    super(base);
    this.mapper = mapper;
    this.thisArg = thisArg;
  }

  next() {
    const { done, value } = this.base.next();
    return {
      done,
      value: done ? undefined : this.mapper.call(this.thisArg, value),
    };
  }
}

class FilterIterator extends Iterator {
  constructor(base, predicate, thisArg) {
    super(base);
    this.predicate = predicate;
    this.thisArg = thisArg;
  }

  next() {
    for (const value of this.base) {
      if (this.predicate.call(this.thisArg, value)) {
        return { done: false, value };
      }
    }
    return { done: true, value: undefined };
  }
}

class FlatIterator extends Iterator {
  constructor(base, depth) {
    super(base);
    this.currentDepth = 0;
    this.stack = new Array(depth + 1);
    this.stack[0] = base;
  }

  next() {
    while (this.currentDepth >= 0) {
      const top = this.stack[this.currentDepth];
      const next = top.next();

      if (next.done) {
        this.stack[this.currentDepth] = null;
        this.currentDepth--;
        continue;
      }

      if (
        this.currentDepth === this.stack.length - 1 ||
        !next.value[Symbol.iterator]
      ) {
        return next;
      }

      this.stack[++this.currentDepth] = next.value[Symbol.iterator]();
    }

    return { done: true, value: undefined };
  }
}

class FlatMapIterator extends Iterator {
  constructor(base, mapper, thisArg) {
    super(base);
    this.mapper = mapper;
    this.thisArg = thisArg;
    this.currentIterator = null;
  }

  next() {
    if (!this.currentIterator) {
      const next = this.base.next();
      if (next.done) {
        return next;
      }

      const value = this.mapper.call(this.thisArg, next.value);
      if (!value[Symbol.iterator]) {
        return { done: false, value };
      }

      this.currentIterator = toIterator(value);
    }

    const next = this.currentIterator.next();

    if (next.done) {
      this.currentIterator = null;
      return this.next();
    }
    return next;
  }
}

class TakeIterator extends Iterator {
  constructor(base, amount) {
    super(base);
    this.amount = amount;
    this.iterated = 0;
  }

  next() {
    this.iterated++;
    if (this.iterated <= this.amount) {
      return this.base.next();
    }
    return { done: true, value: undefined };
  }
}

class TakeWhileIterator extends Iterator {
  constructor(base, predicate, thisArg) {
    super(base);
    this.predicate = predicate;
    this.thisArg = thisArg;
    this.done = false;
  }

  next() {
    if (this.done) return { done: true, value: undefined };
    const next = this.base.next();
    if (!next.done && this.predicate.call(this.thisArg, next.value)) {
      return next;
    }
    this.done = true;
    return { done: true, value: undefined };
  }
}

class ZipIterator extends Iterator {
  constructor(base, iterators) {
    super(base);
    this.iterators = iterators.map(toIterator);
  }

  next() {
    const result = [];

    const next = this.base.next();
    if (next.done) {
      return next;
    }
    result.push(next.value);

    for (const iterator of this.iterators) {
      const next = iterator.next();
      if (next.done) {
        return next;
      }
      result.push(next.value);
    }
    return { done: false, value: result };
  }
}

class ChainIterator extends Iterator {
  constructor(base, iterators) {
    super(base);
    this.currentIterator = base;
    this.iterators = iterators.map(toIterator)[Symbol.iterator]();
  }

  next() {
    const next = this.currentIterator.next();
    if (!next.done) {
      return next;
    }
    const iterator = this.iterators.next();
    if (iterator.done) {
      return iterator;
    }
    this.currentIterator = iterator.value;
    return this.next();
  }
}

class EnumerateIterator extends Iterator {
  constructor(base) {
    super(base);
    this.index = 0;
  }

  next() {
    const next = this.base.next();
    if (next.done) {
      return next;
    }
    return { done: false, value: [this.index++, next.value] };
  }
}

const iter = base => new Iterator(base);

module.exports = {
  Iterator,
  iter,
};
