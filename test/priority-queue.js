'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');

const { PriorityQueue } = metautil;

test('PriorityQueue: push and pop min-heap order', () => {
  const heap = new PriorityQueue();
  heap.push(3);
  heap.push(1);
  heap.push(2);
  assert.strictEqual(heap.size, 3);
  assert.strictEqual(heap.pop(), 1);
  assert.strictEqual(heap.pop(), 2);
  assert.strictEqual(heap.pop(), 3);
  assert.strictEqual(heap.size, 0);
});

test('PriorityQueue: peek does not remove element', () => {
  const heap = new PriorityQueue();
  heap.push(42);
  assert.strictEqual(heap.peek(), 42);
  assert.strictEqual(heap.size, 1);
  assert.strictEqual(heap.peek(), 42);
});

test('PriorityQueue: max-heap with kind option', () => {
  const heap = new PriorityQueue({ kind: 'max' });
  heap.push(1);
  heap.push(3);
  heap.push(2);
  assert.strictEqual(heap.pop(), 3);
  assert.strictEqual(heap.pop(), 2);
  assert.strictEqual(heap.pop(), 1);
});

test('PriorityQueue: custom comparator (objects by priority)', () => {
  const heap = new PriorityQueue({
    compare: (a, b) => a.priority - b.priority,
  });
  heap.push({ id: 'a', priority: 3 });
  heap.push({ id: 'b', priority: 1 });
  heap.push({ id: 'c', priority: 2 });
  assert.deepStrictEqual(heap.pop(), { id: 'b', priority: 1 });
  assert.deepStrictEqual(heap.pop(), { id: 'c', priority: 2 });
  assert.deepStrictEqual(heap.pop(), { id: 'a', priority: 3 });
});

test('PriorityQueue: custom comparator with strings', () => {
  const lexicographic = new PriorityQueue({
    compare: (a, b) => a.localeCompare(b),
  });
  lexicographic.push('banana');
  lexicographic.push('apple');
  lexicographic.push('cherry');
  assert.strictEqual(lexicographic.pop(), 'apple');
  assert.strictEqual(lexicographic.pop(), 'banana');
  assert.strictEqual(lexicographic.pop(), 'cherry');

  const byLength = new PriorityQueue({
    compare: (a, b) => a.length - b.length,
  });
  byLength.push('apple');
  byLength.push('a');
  byLength.push('banana');
  assert.strictEqual(byLength.pop(), 'a');
  assert.strictEqual(byLength.pop(), 'apple');
  assert.strictEqual(byLength.pop(), 'banana');
});

test('PriorityQueue: isEmpty', () => {
  const heap = new PriorityQueue();
  assert.strictEqual(heap.isEmpty(), true);
  heap.push(1);
  assert.strictEqual(heap.isEmpty(), false);
  heap.pop();
  assert.strictEqual(heap.isEmpty(), true);
});

test('PriorityQueue: includes', () => {
  const heap = new PriorityQueue();
  heap.push(1);
  heap.push(2);
  assert.strictEqual(heap.includes(1), true);
  assert.strictEqual(heap.includes(3), false);
});

test('PriorityQueue: clear', () => {
  const heap = new PriorityQueue();
  heap.push(1);
  heap.push(2);
  heap.clear();
  assert.strictEqual(heap.size, 0);
  assert.strictEqual(heap.isEmpty(), true);
});

test('PriorityQueue: toArray', () => {
  const heap = new PriorityQueue();
  heap.push(1);
  heap.push(2);
  heap.push(3);
  const arr = heap.toArray();
  assert.strictEqual(arr.length, 3);
  arr.push(99);
  assert.strictEqual(heap.size, 3);
});

test('PriorityQueue: fromArray', () => {
  const heap = PriorityQueue.fromArray([3, 1, 2]);
  assert.strictEqual(heap.size, 3);
  assert.strictEqual(heap.pop(), 1);
  assert.strictEqual(heap.pop(), 2);
  assert.strictEqual(heap.pop(), 3);
});

test('PriorityQueue: fromArray with max option', () => {
  const heap = PriorityQueue.fromArray([1, 3, 2], { kind: 'max' });
  assert.strictEqual(heap.pop(), 3);
  assert.strictEqual(heap.pop(), 2);
  assert.strictEqual(heap.pop(), 1);
});

test('PriorityQueue: large input', () => {
  const heap = new PriorityQueue();
  const n = 1000;
  for (let i = n; i > 0; i--) heap.push(i);
  for (let i = 1; i <= n; i++) {
    assert.strictEqual(heap.pop(), i);
  }
});

test('PriorityQueue: push undefined', () => {
  const heap = new PriorityQueue();
  heap.push();
  assert.strictEqual(heap.size, 1);
  assert.strictEqual(heap.pop(), undefined);
});

test('PriorityQueue: duplicates', () => {
  const heap = new PriorityQueue();
  heap.push(1);
  heap.push(1);
  heap.push(2);
  assert.strictEqual(heap.pop(), 1);
  assert.strictEqual(heap.pop(), 1);
  assert.strictEqual(heap.pop(), 2);
});

test('PriorityQueue: constructor with comparator function', () => {
  const heap = new PriorityQueue({
    compare: (a, b) => a.length - b.length,
  });
  heap.push('apple');
  heap.push('a');
  heap.push('banana');
  assert.strictEqual(heap.pop(), 'a');
  assert.strictEqual(heap.pop(), 'apple');
  assert.strictEqual(heap.pop(), 'banana');
});

test('PriorityQueue: interleaved push and pop min-heap', () => {
  const heap = new PriorityQueue();
  heap.push(5);
  heap.push(2);
  assert.strictEqual(heap.pop(), 2);
  heap.push(8);
  heap.push(1);
  assert.strictEqual(heap.pop(), 1);
  heap.push(9);
  assert.strictEqual(heap.pop(), 5);
  assert.strictEqual(heap.pop(), 8);
  assert.strictEqual(heap.pop(), 9);
  assert.strictEqual(heap.pop(), undefined);
});

test('PriorityQueue: interleaved push and pop max-heap', () => {
  const heap = new PriorityQueue({ kind: 'max' });
  heap.push(2);
  heap.push(5);
  assert.strictEqual(heap.pop(), 5);
  heap.push(1);
  heap.push(8);
  assert.strictEqual(heap.pop(), 8);
  heap.push(3);
  assert.strictEqual(heap.pop(), 3);
  assert.strictEqual(heap.pop(), 2);
  assert.strictEqual(heap.pop(), 1);
});

test('PriorityQueue: interleaved push and pop custom comparator', () => {
  // Descending comparator exercises max order through the comparator path
  const heap = new PriorityQueue({ compare: (a, b) => b - a });
  heap.push(4);
  heap.push(7);
  assert.strictEqual(heap.pop(), 7);
  heap.push(2);
  heap.push(9);
  assert.strictEqual(heap.pop(), 9);
  heap.push(6);
  assert.strictEqual(heap.pop(), 6);
  assert.strictEqual(heap.pop(), 4);
  assert.strictEqual(heap.pop(), 2);
});

test('PriorityQueue: fromArray with custom comparator', () => {
  const heap = PriorityQueue.fromArray(
    [
      { id: 'a', p: 3 },
      { id: 'b', p: 1 },
      { id: 'c', p: 2 },
    ],
    { compare: (a, b) => a.p - b.p },
  );
  assert.strictEqual(heap.size, 3);
  assert.deepStrictEqual(heap.pop(), { id: 'b', p: 1 });
  assert.deepStrictEqual(heap.pop(), { id: 'c', p: 2 });
  assert.deepStrictEqual(heap.pop(), { id: 'a', p: 3 });
});

test('PriorityQueue: fromArray empty array', () => {
  const heap = PriorityQueue.fromArray([]);
  assert.strictEqual(heap.size, 0);
  assert.strictEqual(heap.isEmpty(), true);
  assert.strictEqual(heap.pop(), undefined);
});

test('PriorityQueue: fromArray single element', () => {
  const heap = PriorityQueue.fromArray([42]);
  assert.strictEqual(heap.size, 1);
  assert.strictEqual(heap.peek(), 42);
  assert.strictEqual(heap.pop(), 42);
});

test('PriorityQueue: fromArray with duplicates', () => {
  const heap = PriorityQueue.fromArray([2, 1, 2, 1, 3]);
  assert.strictEqual(heap.size, 5);
  assert.strictEqual(heap.pop(), 1);
  assert.strictEqual(heap.pop(), 1);
  assert.strictEqual(heap.pop(), 2);
  assert.strictEqual(heap.pop(), 2);
  assert.strictEqual(heap.pop(), 3);
});

test('PriorityQueue: mixed positive and negative', () => {
  const heap = new PriorityQueue();
  heap.push(5);
  heap.push(-5);
  heap.push(0);
  assert.strictEqual(heap.pop(), -5);
  assert.strictEqual(heap.pop(), 0);
  assert.strictEqual(heap.pop(), 5);
});

test('PriorityQueue: falsy values', () => {
  const heap = new PriorityQueue();
  heap.push(0);
  heap.push(null);
  heap.push(false);
  heap.push('');
  // Default comparison: all falsy values except '' coerce to 0;
  // '' is coerced to 0 by comparison. Order among 0-equal
  // elements depends on heap stability (not guaranteed).
  // Just check that they all come out and the heap is empty.
  const results = [heap.pop(), heap.pop(), heap.pop(), heap.pop()];
  assert.strictEqual(heap.size, 0);
  assert.strictEqual(results.length, 4);
});

test('PriorityQueue: reuse after clear', () => {
  const heap = new PriorityQueue();
  heap.push(3);
  heap.push(1);
  heap.clear();
  heap.push(5);
  heap.push(2);
  assert.strictEqual(heap.pop(), 2);
  assert.strictEqual(heap.pop(), 5);
});

test('PriorityQueue: includes after pop', () => {
  const heap = new PriorityQueue();
  heap.push(1);
  heap.push(2);
  heap.push(3);
  heap.pop(); // removes 1
  assert.strictEqual(heap.includes(1), false);
  assert.strictEqual(heap.includes(2), true);
  assert.strictEqual(heap.includes(3), true);
});

test('PriorityQueue: includes with objects uses reference equality', () => {
  const obj = { id: 1 };
  const heap = new PriorityQueue({ compare: (a, b) => a.id - b.id });
  heap.push(obj);
  assert.strictEqual(heap.includes(obj), true);
  assert.strictEqual(heap.includes({ id: 1 }), false);
});

test('PriorityQueue: Symbol.iterator on empty heap', () => {
  const heap = new PriorityQueue();
  assert.deepStrictEqual([...heap], []);
});

test('PriorityQueue: Symbol.iterator does not consume elements', () => {
  const heap = PriorityQueue.fromArray([3, 1, 2]);
  const first = [...heap];
  const second = [...heap];
  assert.deepStrictEqual(first, second);
  // Iterator yields the raw heap array (not sorted); verify all values present
  assert.deepStrictEqual(
    first.sort((a, b) => a - b),
    [1, 2, 3],
  );
  assert.strictEqual(heap.size, 3);
});

test('PriorityQueue: toArray on empty heap', () => {
  const heap = new PriorityQueue();
  assert.deepStrictEqual(heap.toArray(), []);
});

test('PriorityQueue: toArray after pops', () => {
  const heap = new PriorityQueue();
  heap.push(3);
  heap.push(1);
  heap.push(2);
  heap.pop(); // removes 1
  const arr = heap.toArray();
  assert.strictEqual(arr.length, 2);
  assert.strictEqual(arr.includes(2), true);
  assert.strictEqual(arr.includes(3), true);
  assert.strictEqual(arr.includes(1), false);
});

test('PriorityQueue: unknown kind defaults to min-heap', () => {
  const heap = new PriorityQueue({ kind: 'bogus' });
  heap.push(3);
  heap.push(1);
  heap.push(2);
  assert.strictEqual(heap.pop(), 1);
  assert.strictEqual(heap.pop(), 2);
  assert.strictEqual(heap.pop(), 3);
});

test('PriorityQueue: non-function compare is ignored', () => {
  const heap = new PriorityQueue({ compare: 'not a function' });
  heap.push(3);
  heap.push(1);
  heap.push(2);
  assert.strictEqual(heap.pop(), 1);
  assert.strictEqual(heap.pop(), 2);
  assert.strictEqual(heap.pop(), 3);
});

test('PriorityQueue: comparator returning zero treats elements equal', () => {
  const heap = new PriorityQueue({ compare: () => 0 });
  heap.push(3);
  heap.push(1);
  heap.push(2);
  // All elements are equal according to comparator;
  // order is not specified but heap must not crash.
  assert.strictEqual(heap.size, 3);
  heap.pop();
  heap.pop();
  heap.pop();
  assert.strictEqual(heap.size, 0);
});

test('PriorityQueue: comparator returning non-integer', () => {
  const heap = new PriorityQueue({ compare: (a, b) => a.p - b.p });
  heap.push({ p: 0.5 });
  heap.push({ p: 0.1 });
  heap.push({ p: 0.3 });
  assert.deepStrictEqual(heap.pop(), { p: 0.1 });
  assert.deepStrictEqual(heap.pop(), { p: 0.3 });
  assert.deepStrictEqual(heap.pop(), { p: 0.5 });
});

test('PriorityQueue: mixed numbers and numeric strings', () => {
  const heap = new PriorityQueue();
  heap.push('10');
  heap.push(2);
  heap.push('3');
  // Default comparison coerces to numbers when types differ.
  // However, when both are strings ('10' >= '3'), JS uses
  // lexicographic order, so the heap treats '10' < '3'.
  assert.strictEqual(heap.pop(), 2);
  assert.strictEqual(heap.pop(), '10');
  assert.strictEqual(heap.pop(), '3');
});

test('PriorityQueue: push single then pop multiple times', () => {
  const heap = new PriorityQueue();
  heap.push(42);
  assert.strictEqual(heap.pop(), 42);
  assert.strictEqual(heap.pop(), undefined);
  assert.strictEqual(heap.pop(), undefined);
  assert.strictEqual(heap.size, 0);
});

test('PriorityQueue: peek after all popped', () => {
  const heap = new PriorityQueue();
  heap.push(1);
  heap.pop();
  assert.strictEqual(heap.peek(), undefined);
  assert.strictEqual(heap.isEmpty(), true);
});

test('PriorityQueue: fromArray throws on non-iterable', () => {
  assert.throws(() => PriorityQueue.fromArray(null), TypeError);
  assert.throws(() => PriorityQueue.fromArray(undefined), TypeError);
  assert.throws(() => PriorityQueue.fromArray(42), TypeError);
});
