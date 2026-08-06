'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');

const { CircularBuffer } = metautil;

test('CircularBuffer: push and shift (queue-like)', () => {
  const buf = new CircularBuffer();
  buf.push(1);
  buf.push(2);
  buf.push(3);
  assert.strictEqual(buf.size, 3);
  assert.strictEqual(buf.shift(), 1);
  assert.strictEqual(buf.shift(), 2);
  assert.strictEqual(buf.size, 1);
});

test('CircularBuffer: unshift and shift (stack-like)', () => {
  const buf = new CircularBuffer();
  buf.unshift(1);
  buf.unshift(2);
  buf.unshift(3);
  assert.strictEqual(buf.shift(), 3);
  assert.strictEqual(buf.shift(), 2);
  assert.strictEqual(buf.shift(), 1);
});

test('CircularBuffer: unshift and pop', () => {
  const buf = new CircularBuffer();
  buf.unshift(1);
  buf.unshift(2);
  assert.strictEqual(buf.pop(), 1);
  assert.strictEqual(buf.pop(), 2);
});

test('CircularBuffer: push and pop', () => {
  const buf = new CircularBuffer();
  buf.push(1);
  buf.push(2);
  assert.strictEqual(buf.pop(), 2);
  assert.strictEqual(buf.pop(), 1);
});

test('CircularBuffer: shift/pop empty returns undefined', () => {
  const buf = new CircularBuffer();
  assert.strictEqual(buf.shift(), undefined);
  assert.strictEqual(buf.pop(), undefined);
});

test('CircularBuffer: at', () => {
  const buf = CircularBuffer.fromArray([10, 20, 30]);
  assert.strictEqual(buf.at(0), 10);
  assert.strictEqual(buf.at(1), 20);
  assert.strictEqual(buf.at(2), 30);
  assert.strictEqual(buf.at(-1), 30);
  assert.strictEqual(buf.at(-2), 20);
  assert.strictEqual(buf.at(3), undefined);
  assert.strictEqual(buf.at(-4), undefined);
});

test('CircularBuffer: at after wrap', () => {
  const buf = new CircularBuffer();
  buf.push(1);
  buf.push(2);
  buf.push(3);
  buf.shift();
  buf.push(4);
  assert.strictEqual(buf.at(0), 2);
  assert.strictEqual(buf.at(-1), 4);
  assert.deepStrictEqual(buf.toArray(), [2, 3, 4]);
});

test('CircularBuffer: isEmpty', () => {
  const buf = new CircularBuffer();
  assert.strictEqual(buf.isEmpty(), true);
  buf.push(1);
  assert.strictEqual(buf.isEmpty(), false);
  buf.shift();
  assert.strictEqual(buf.isEmpty(), true);
});

test('CircularBuffer: includes', () => {
  const buf = CircularBuffer.fromArray([1, 2, 3]);
  assert.strictEqual(buf.includes(2), true);
  assert.strictEqual(buf.includes(5), false);
});

test('CircularBuffer: clear', () => {
  const buf = CircularBuffer.fromArray([1, 2, 3]);
  buf.clear();
  assert.strictEqual(buf.size, 0);
  assert.strictEqual(buf.isEmpty(), true);
  assert.strictEqual(buf.shift(), undefined);
});

test('CircularBuffer: toArray', () => {
  const buf = CircularBuffer.fromArray([1, 2, 3]);
  const arr = buf.toArray();
  assert.deepStrictEqual(arr, [1, 2, 3]);
  arr.push(99);
  assert.strictEqual(buf.size, 3);
});

test('CircularBuffer: fromArray', () => {
  const buf = CircularBuffer.fromArray([5, 10, 15]);
  assert.strictEqual(buf.size, 3);
  assert.deepStrictEqual(buf.toArray(), [5, 10, 15]);
});

test('CircularBuffer: fromArray empty', () => {
  const buf = CircularBuffer.fromArray([]);
  assert.strictEqual(buf.size, 0);
  assert.strictEqual(buf.isEmpty(), true);
});

test('CircularBuffer: grows beyond initial capacity', () => {
  const buf = new CircularBuffer();
  for (let i = 0; i < 40; i++) buf.push(i);
  assert.strictEqual(buf.size, 40);
  assert.strictEqual(buf.shift(), 0);
  assert.strictEqual(buf.pop(), 39);
  assert.strictEqual(buf.size, 38);
  assert.strictEqual(buf.at(0), 1);
  assert.strictEqual(buf.at(-1), 38);
});

test('CircularBuffer: Symbol.iterator', () => {
  const buf = CircularBuffer.fromArray([1, 2, 3]);
  assert.deepStrictEqual([...buf], [1, 2, 3]);
});

test('CircularBuffer: undefined is a valid value', () => {
  const buf = new CircularBuffer();
  buf.push(undefined);
  assert.strictEqual(buf.size, 1);
  assert.strictEqual(buf.at(0), undefined);
  assert.strictEqual(buf.shift(), undefined);
  assert.strictEqual(buf.size, 0);
});

test('CircularBuffer: every and reduce', () => {
  const buf = CircularBuffer.fromArray([2, 4, 6]);
  assert.strictEqual(
    buf.every((v) => v % 2 === 0),
    true,
  );
  assert.strictEqual(
    buf.every((v) => v < 6),
    false,
  );
  assert.strictEqual(
    new CircularBuffer().every(() => false),
    true,
  );
  assert.strictEqual(
    buf.reduce((acc, v) => acc + v, 0),
    12,
  );
  assert.strictEqual(
    buf.reduce((acc, v) => acc + v),
    12,
  );
  assert.strictEqual(
    new CircularBuffer().reduce((acc, v) => acc + v, 7),
    7,
  );
  assert.throws(
    () => new CircularBuffer().reduce((acc, v) => acc + v),
    /CircularBuffer is empty/,
  );
  const withoutSeed = [];
  CircularBuffer.fromArray([1, 2]).reduce((acc, v) => {
    withoutSeed.push([acc, v]);
    return acc + v;
  });
  assert.deepStrictEqual(withoutSeed, [[1, 2]]);
  assert.deepStrictEqual(
    CircularBuffer.fromArray([1, 2]).reduce((acc, v) => [acc, v], undefined),
    [1, 2],
  );
});
