'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');

const { Stack, Queue, Deque, List, PersistentList } = metautil;

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
  assert.strictEqual(deque.first(), 10);
  assert.strictEqual(deque.last(), 30);
});

test('Interop: Deque → Array → List', () => {
  const deque = Deque.fromArray([5, 10, 15]);
  const list = List.fromArray(deque.toArray());
  assert.strictEqual(list.sum(), 30);
});

test('Interop: List → Array → Stack', () => {
  const list = List.range(1, 5);
  const stack = Stack.fromArray(list.toArray());
  assert.strictEqual(stack.pop(), 5);
  assert.strictEqual(stack.pop(), 4);
});

test('Interop: PersistentList → Array → List', () => {
  const persistent = PersistentList.of(3, 1, 4, 1, 5);
  const list = List.fromArray(persistent.toArray());
  list.sort();
  assert.deepStrictEqual(list.toArray(), [1, 1, 3, 4, 5]);
});

test('Interop: List → Array → PersistentList', () => {
  const list = List.fromArray([1, 2, 3]);
  const persistent = PersistentList.fromArray(list.toArray());
  assert.deepStrictEqual(persistent.toArray(), [1, 2, 3]);
});

// --- Using iterables across structures ---

test('Interop: Stack.fromIterable(List)', () => {
  const list = List.fromArray([7, 8, 9]);
  const stack = Stack.fromIterable(list);
  assert.strictEqual(stack.size, 3);
  assert.strictEqual(stack.peek(), 9);
});

test('Interop: Queue.fromIterable(Deque)', () => {
  const deque = Deque.fromArray([100, 200, 300]);
  const queue = Queue.fromIterable(deque);
  assert.strictEqual(queue.size, 3);
  assert.strictEqual(queue.dequeue(), 100);
});

test('Interop: Deque.fromIterable(PersistentList)', () => {
  const persistent = PersistentList.of(1, 2, 3, 4);
  const deque = Deque.fromIterable(persistent);
  deque.rotateLeft(1);
  assert.deepStrictEqual(deque.toArray(), [2, 3, 4, 1]);
});

test('Interop: List.fromIterable(Stack)', () => {
  const stack = Stack.fromArray([1, 2, 3]);
  const list = List.fromIterable(stack);
  assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
});

test('Interop: List.fromIterable(Queue)', () => {
  const queue = Queue.fromArray([10, 20, 30]);
  const list = List.fromIterable(queue);
  assert.strictEqual(list.sum(), 60);
});

test('Interop: PersistentList.fromIterable(List)', () => {
  const list = List.fromArray([5, 6, 7]);
  const persistent = PersistentList.fromIterable(list);
  assert.deepStrictEqual(persistent.toArray(), [5, 6, 7]);
});

// --- Cross-structure functional pipeline ---

test('Interop: filter from List, collect into Queue', () => {
  const numbers = List.range(1, 10);
  const evens = numbers.filter((n) => n % 2 === 0);
  const queue = Queue.fromIterable(evens);
  assert.strictEqual(queue.size, 5);
  assert.strictEqual(queue.dequeue(), 2);
  assert.strictEqual(queue.dequeue(), 4);
});

test('Interop: merge multiple structures via List.merge', () => {
  const a = List.fromArray([1, 2]);
  const b = List.fromArray(Deque.fromArray([3, 4]).toArray());
  const c = List.fromArray(Stack.fromArray([5, 6]).toArray());
  const merged = List.merge([a, b, c]);
  assert.deepStrictEqual(merged.toArray(), [1, 2, 3, 4, 5, 6]);
});

test('Interop: Deque.range consumed by PersistentList', () => {
  const deque = Deque.range(1, 4);
  const persistent = PersistentList.fromIterable(deque);
  assert.strictEqual(persistent.size, 4);
  assert.strictEqual(persistent.value, 1);
});
