'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');

const { Deque } = metautil;

test('Deque: append and dequeue (queue-like)', () => {
  const deque = new Deque();
  deque.append(1);
  deque.append(2);
  deque.append(3);
  assert.strictEqual(deque.size, 3);
  assert.strictEqual(deque.dequeue(), 1);
  assert.strictEqual(deque.dequeue(), 2);
  assert.strictEqual(deque.size, 1);
});

test('Deque: prepend and dequeue (stack-like)', () => {
  const deque = new Deque();
  deque.prepend(1);
  deque.prepend(2);
  deque.prepend(3);
  assert.strictEqual(deque.dequeue(), 3);
  assert.strictEqual(deque.dequeue(), 2);
  assert.strictEqual(deque.dequeue(), 1);
});

test('Deque: prepend and pop', () => {
  const deque = new Deque();
  deque.prepend(1);
  deque.prepend(2);
  assert.strictEqual(deque.pop(), 1);
  assert.strictEqual(deque.pop(), 2);
});

test('Deque: dequeue empty returns undefined', () => {
  const deque = new Deque();
  assert.strictEqual(deque.dequeue(), undefined);
  assert.strictEqual(deque.pop(), undefined);
});

test('Deque: at and set', () => {
  const deque = Deque.fromArray([10, 20, 30]);
  assert.strictEqual(deque.at(0), 10);
  assert.strictEqual(deque.at(1), 20);
  assert.strictEqual(deque.at(2), 30);
  assert.strictEqual(deque.at(-1), undefined);
  assert.strictEqual(deque.at(3), undefined);
  deque.set(1, 99);
  assert.strictEqual(deque.at(1), 99);
});

test('Deque: first and last', () => {
  const deque = Deque.fromArray([1, 2, 3]);
  assert.strictEqual(deque.first(), 1);
  assert.strictEqual(deque.last(), 3);
});

test('Deque: isEmpty', () => {
  const deque = new Deque();
  assert.strictEqual(deque.isEmpty(), true);
  deque.append(1);
  assert.strictEqual(deque.isEmpty(), false);
  deque.dequeue();
  assert.strictEqual(deque.isEmpty(), true);
});

test('Deque: includes', () => {
  const deque = Deque.fromArray([1, 2, 3]);
  assert.strictEqual(deque.includes(2), true);
  assert.strictEqual(deque.includes(5), false);
});

test('Deque: equals', () => {
  const a = Deque.fromArray([1, 2, 3]);
  const b = Deque.fromArray([1, 2, 3]);
  const c = Deque.fromArray([1, 2, 4]);
  assert.strictEqual(a.equals(b), true);
  assert.strictEqual(a.equals(c), false);
  assert.strictEqual(a.equals(new Deque()), false);
});

test('Deque: rotateLeft', () => {
  const deque = Deque.fromArray([1, 2, 3, 4, 5]);
  deque.rotateLeft(2);
  assert.deepStrictEqual(deque.toArray(), [3, 4, 5, 1, 2]);
});

test('Deque: rotateRight', () => {
  const deque = Deque.fromArray([1, 2, 3, 4, 5]);
  deque.rotateRight(2);
  assert.deepStrictEqual(deque.toArray(), [4, 5, 1, 2, 3]);
});

test('Deque: rotateLeft wraps with modulo', () => {
  const deque = Deque.fromArray([1, 2, 3]);
  deque.rotateLeft(4);
  assert.deepStrictEqual(deque.toArray(), [2, 3, 1]);
});

test('Deque: rotate on empty does nothing', () => {
  const deque = new Deque();
  deque.rotateLeft(3);
  deque.rotateRight(3);
  assert.strictEqual(deque.size, 0);
});

test('Deque: clear', () => {
  const deque = Deque.fromArray([1, 2, 3]);
  deque.clear();
  assert.strictEqual(deque.size, 0);
  assert.strictEqual(deque.isEmpty(), true);
});

test('Deque: toArray', () => {
  const deque = Deque.fromArray([1, 2, 3]);
  const arr = deque.toArray();
  assert.deepStrictEqual(arr, [1, 2, 3]);
  arr.push(99);
  assert.strictEqual(deque.size, 3);
});

test('Deque: clone', () => {
  const deque = Deque.fromArray([1, 2, 3]);
  const clone = deque.clone();
  assert.strictEqual(clone.size, 3);
  clone.append(4);
  assert.strictEqual(deque.size, 3);
  assert.strictEqual(clone.size, 4);
});

test('Deque: fromArray', () => {
  const deque = Deque.fromArray([5, 10, 15]);
  assert.strictEqual(deque.size, 3);
  assert.deepStrictEqual(deque.toArray(), [5, 10, 15]);
});

test('Deque: fromIterable', () => {
  const deque = Deque.fromIterable(new Set([1, 2, 3]));
  assert.strictEqual(deque.size, 3);
});

test('Deque: range ascending', () => {
  const deque = Deque.range(1, 5);
  assert.deepStrictEqual(deque.toArray(), [1, 2, 3, 4, 5]);
});

test('Deque: range with step', () => {
  const deque = Deque.range(0, 10, 2);
  assert.deepStrictEqual(deque.toArray(), [0, 2, 4, 6, 8, 10]);
});

test('Deque: range descending', () => {
  const deque = Deque.range(5, 1, -1);
  assert.deepStrictEqual(deque.toArray(), [5, 4, 3, 2, 1]);
});

test('Deque: Symbol.iterator', () => {
  const deque = Deque.fromArray([1, 2, 3]);
  assert.deepStrictEqual([...deque], [1, 2, 3]);
});

test('Deque: Symbol.asyncIterator', async () => {
  const deque = Deque.fromArray([1, 2, 3]);
  const values = [];
  for await (const value of deque) values.push(value);
  assert.deepStrictEqual(values, [1, 2, 3]);
});
