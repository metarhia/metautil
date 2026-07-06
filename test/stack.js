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

test('Stack: first and last', () => {
  const stack = new Stack();
  stack.push(1);
  stack.push(2);
  stack.push(3);
  assert.strictEqual(stack.first(), 1);
  assert.strictEqual(stack.last(), 3);
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

test('Stack: clone', () => {
  const stack = new Stack();
  stack.push(1);
  stack.push(2);
  const clone = stack.clone();
  assert.strictEqual(clone.size, 2);
  clone.push(3);
  assert.strictEqual(stack.size, 2);
  assert.strictEqual(clone.size, 3);
});

test('Stack: fromArray', () => {
  const stack = Stack.fromArray([1, 2, 3]);
  assert.strictEqual(stack.size, 3);
  assert.strictEqual(stack.pop(), 3);
  assert.strictEqual(stack.pop(), 2);
});

test('Stack: fromIterable', () => {
  const stack = Stack.fromIterable(new Set([10, 20, 30]));
  assert.strictEqual(stack.size, 3);
  assert.strictEqual(stack.includes(10), true);
  assert.strictEqual(stack.includes(20), true);
  assert.strictEqual(stack.includes(30), true);
});

test('Stack: Symbol.iterator', () => {
  const stack = Stack.fromArray([1, 2, 3]);
  assert.deepStrictEqual([...stack], [1, 2, 3]);
});

test('Stack: Symbol.asyncIterator', async () => {
  const stack = Stack.fromArray([1, 2, 3]);
  const values = [];
  for await (const value of stack) values.push(value);
  assert.deepStrictEqual(values, [1, 2, 3]);
});
