'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');

const { Stack, Queue, Deque, List, ConsList } = metautil;

// --- Array as universal interchange format ---

test('Interop: Stack → Array → Queue', () => {
  const stack = Stack.fromArray([1, 2, 3]);
  const queue = Queue.fromArray(stack.toArray());
  assert.deepStrictEqual(queue.toArray(), [1, 2, 3]);
  assert.strictEqual(queue.dequeue(), 1);
});

test('Interop: Queue → Array → Deque', () => {
  const queue = Queue.fromArray([10, 20, 30]);
  const deque = Deque.fromArray(queue.toArray());
  assert.deepStrictEqual(deque.toArray(), [10, 20, 30]);
});

test('Interop: Deque → Array → List', () => {
  const deque = Deque.fromArray([5, 10, 15]);
  const list = List.fromArray(deque.toArray());
  assert.strictEqual(list.sum(), 30);
});

test('Interop: List → Array → Stack', () => {
  const list = List.fromArray([1, 2, 3, 4, 5]);
  const stack = Stack.fromArray(list.toArray());
  assert.strictEqual(stack.pop(), 5);
  assert.strictEqual(stack.pop(), 4);
});

test('Interop: ConsList → Array → List', () => {
  const cons = ConsList.of(3, 1, 4, 1, 5);
  const list = List.fromArray(cons.toArray());
  list.sort();
  assert.deepStrictEqual(list.toArray(), [1, 1, 3, 4, 5]);
});

test('Interop: List → Array → ConsList', () => {
  const list = List.fromArray([1, 2, 3]);
  const cons = ConsList.fromArray(list.toArray());
  assert.deepStrictEqual(cons.toArray(), [1, 2, 3]);
});

// --- Using iterables / arrays across structures ---

test('Interop: Stack.fromArray(List.toArray())', () => {
  const list = List.fromArray([7, 8, 9]);
  const stack = Stack.fromArray(list.toArray());
  assert.strictEqual(stack.size, 3);
  assert.strictEqual(stack.pop(), 9);
});

test('Interop: Queue.fromArray(Deque.toArray())', () => {
  const deque = Deque.fromArray([100, 200, 300]);
  const queue = Queue.fromArray(deque.toArray());
  assert.strictEqual(queue.size, 3);
  assert.strictEqual(queue.dequeue(), 100);
});

test('Interop: Deque.fromArray(ConsList.toArray())', () => {
  const cons = ConsList.of(1, 2, 3, 4);
  const deque = Deque.fromArray(cons.toArray());
  assert.deepStrictEqual(deque.toArray(), [1, 2, 3, 4]);
});

test('Interop: List.fromArray(Stack.toArray())', () => {
  const stack = Stack.fromArray([1, 2, 3]);
  const list = List.fromArray(stack.toArray());
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('Interop: List.fromArray(Queue.toArray())', () => {
  const queue = Queue.fromArray([10, 20, 30]);
  const list = List.fromArray(queue.toArray());
  assert.strictEqual(list.sum(), 60);
});

test('Interop: ConsList.fromIterable(List)', () => {
  const list = List.fromArray([5, 6, 7]);
  const cons = ConsList.fromIterable(list);
  assert.deepStrictEqual(cons.toArray(), [5, 6, 7]);
});

// --- Cross-structure functional pipeline ---

test('Interop: filter from List, collect into Queue', () => {
  const numbers = List.fromArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const evens = numbers.filter((n) => n % 2 === 0);
  const queue = Queue.fromArray(evens.toArray());
  assert.strictEqual(queue.size, 5);
  assert.strictEqual(queue.dequeue(), 2);
  assert.strictEqual(queue.dequeue(), 4);
});

test('Interop: merge multiple structures via List.merge', () => {
  const a = List.fromArray([1, 2]);
  const b = List.fromArray(Deque.fromArray([3, 4]).toArray());
  const c = List.fromArray(Stack.fromArray([5, 6]).toArray());
  const merged = List.merge(a, b, c);
  assert.deepStrictEqual(merged.toArray(), [1, 2, 3, 4, 5, 6]);
});

test('Interop: Deque.fromArray consumed by ConsList', () => {
  const deque = Deque.fromArray([1, 2, 3, 4]);
  const cons = ConsList.fromIterable(deque);
  assert.strictEqual(cons.size, 4);
  assert.strictEqual(cons.value, 1);
});
