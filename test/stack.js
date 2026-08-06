'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');

const { Stack } = metautil;

test('Stack: push and pop', () => {
  const stack = new Stack();
  stack.push(1);
  stack.push(2);
  stack.push(3);
  assert.strictEqual(stack.size, 3);
  assert.strictEqual(stack.pop(), 3);
  assert.strictEqual(stack.pop(), 2);
  assert.strictEqual(stack.size, 1);
});

test('Stack: pop empty returns undefined', () => {
  const stack = new Stack();
  assert.strictEqual(stack.pop(), undefined);
});

test('Stack: peek does not remove element', () => {
  const stack = new Stack();
  stack.push(42);
  assert.strictEqual(stack.peek(), 42);
  assert.strictEqual(stack.size, 1);
  assert.strictEqual(stack.peek(), 42);
});

test('Stack: peek empty returns undefined', () => {
  const stack = new Stack();
  assert.strictEqual(stack.peek(), undefined);
});

test('Stack: isEmpty', () => {
  const stack = new Stack();
  assert.strictEqual(stack.isEmpty(), true);
  stack.push(1);
  assert.strictEqual(stack.isEmpty(), false);
  stack.pop();
  assert.strictEqual(stack.isEmpty(), true);
});

test('Stack: includes', () => {
  const stack = new Stack();
  stack.push(1);
  stack.push(2);
  assert.strictEqual(stack.includes(1), true);
  assert.strictEqual(stack.includes(3), false);
});

test('Stack: clear', () => {
  const stack = new Stack();
  stack.push(1);
  stack.push(2);
  stack.clear();
  assert.strictEqual(stack.size, 0);
  assert.strictEqual(stack.isEmpty(), true);
});

test('Stack: toArray', () => {
  const stack = new Stack();
  stack.push(1);
  stack.push(2);
  stack.push(3);
  const arr = stack.toArray();
  assert.deepStrictEqual(arr, [1, 2, 3]);
  arr.push(99);
  assert.strictEqual(stack.size, 3);
});

test('Stack: fromArray', () => {
  const stack = Stack.fromArray([1, 2, 3]);
  assert.strictEqual(stack.size, 3);
  assert.strictEqual(stack.pop(), 3);
  assert.strictEqual(stack.pop(), 2);
});

test('Stack: Symbol.iterator', () => {
  const stack = Stack.fromArray([1, 2, 3]);
  assert.deepStrictEqual([...stack], [1, 2, 3]);
});

test('Stack: every', () => {
  const stack = Stack.fromArray([1, 2, 3]);
  assert.strictEqual(
    stack.every((v) => v > 0),
    true,
  );
  assert.strictEqual(
    stack.every((v) => v < 2),
    false,
  );
  assert.strictEqual(
    new Stack().every(() => false),
    true,
  );
});

test('Stack: reduce', () => {
  const stack = Stack.fromArray([1, 2, 3]);
  assert.strictEqual(
    stack.reduce((acc, v) => acc + v, 0),
    6,
  );
  assert.strictEqual(
    stack.reduce((acc, v) => acc + v),
    6,
  );
  assert.throws(
    () => new Stack().reduce((acc, v) => acc + v),
    /CircularBuffer is empty/,
  );
  assert.strictEqual(
    new Stack().reduce((acc, v) => acc + v, 7),
    7,
  );
});
