'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');

const { Deque } = metautil;

test('Deque: push and shift (queue-like)', () => {
  const deque = new Deque();
  deque.push(1);
  deque.push(2);
  deque.push(3);
  assert.strictEqual(deque.size, 3);
  assert.strictEqual(deque.shift(), 1);
  assert.strictEqual(deque.shift(), 2);
  assert.strictEqual(deque.size, 1);
});

test('Deque: unshift and shift (stack-like)', () => {
  const deque = new Deque();
  deque.unshift(1);
  deque.unshift(2);
  deque.unshift(3);
  assert.strictEqual(deque.shift(), 3);
  assert.strictEqual(deque.shift(), 2);
  assert.strictEqual(deque.shift(), 1);
});

test('Deque: unshift and pop', () => {
  const deque = new Deque();
  deque.unshift(1);
  deque.unshift(2);
  assert.strictEqual(deque.pop(), 1);
  assert.strictEqual(deque.pop(), 2);
});

test('Deque: shift/pop empty returns undefined', () => {
  const deque = new Deque();
  assert.strictEqual(deque.shift(), undefined);
  assert.strictEqual(deque.pop(), undefined);
});

test('Deque: isEmpty', () => {
  const deque = new Deque();
  assert.strictEqual(deque.isEmpty(), true);
  deque.push(1);
  assert.strictEqual(deque.isEmpty(), false);
  deque.shift();
  assert.strictEqual(deque.isEmpty(), true);
});

test('Deque: includes', () => {
  const deque = Deque.fromArray([1, 2, 3]);
  assert.strictEqual(deque.includes(2), true);
  assert.strictEqual(deque.includes(5), false);
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

test('Deque: fromArray', () => {
  const deque = Deque.fromArray([5, 10, 15]);
  assert.strictEqual(deque.size, 3);
  assert.deepStrictEqual(deque.toArray(), [5, 10, 15]);
});

test('Deque: Symbol.iterator', () => {
  const deque = Deque.fromArray([1, 2, 3]);
  assert.deepStrictEqual([...deque], [1, 2, 3]);
});

test('Deque: every', () => {
  const deque = Deque.fromArray([1, 2, 3]);
  assert.strictEqual(
    deque.every((v) => v > 0),
    true,
  );
  assert.strictEqual(
    deque.every((v) => v < 3),
    false,
  );
  assert.strictEqual(
    new Deque().every(() => false),
    true,
  );
});

test('Deque: reduce', () => {
  const deque = Deque.fromArray([1, 2, 3, 4]);
  assert.strictEqual(
    deque.reduce((acc, v) => acc + v, 0),
    10,
  );
  assert.strictEqual(
    deque.reduce((acc, v) => acc + v),
    10,
  );
  assert.throws(
    () => new Deque().reduce((acc, v) => acc + v),
    /CircularBuffer is empty/,
  );
  assert.strictEqual(
    new Deque().reduce((acc, v) => acc + v, 7),
    7,
  );
  const withoutSeed = [];
  Deque.fromArray([1, 2]).reduce((acc, v) => {
    withoutSeed.push([acc, v]);
    return acc + v;
  });
  assert.deepStrictEqual(withoutSeed, [[1, 2]]);
});
