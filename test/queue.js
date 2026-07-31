'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');

const { Queue } = metautil;

test('Queue: enqueue and dequeue FIFO order', () => {
  const queue = new Queue();
  queue.enqueue(1);
  queue.enqueue(2);
  queue.enqueue(3);
  assert.strictEqual(queue.size, 3);
  assert.strictEqual(queue.dequeue(), 1);
  assert.strictEqual(queue.dequeue(), 2);
  assert.strictEqual(queue.dequeue(), 3);
  assert.strictEqual(queue.size, 0);
});

test('Queue: dequeue empty returns undefined', () => {
  const queue = new Queue();
  assert.strictEqual(queue.dequeue(), undefined);
});

test('Queue: peek does not remove element', () => {
  const queue = new Queue();
  queue.enqueue(42);
  assert.strictEqual(queue.peek(), 42);
  assert.strictEqual(queue.size, 1);
  assert.strictEqual(queue.peek(), 42);
});

test('Queue: peek empty returns undefined', () => {
  const queue = new Queue();
  assert.strictEqual(queue.peek(), undefined);
});

test('Queue: isEmpty', () => {
  const queue = new Queue();
  assert.strictEqual(queue.isEmpty(), true);
  queue.enqueue(1);
  assert.strictEqual(queue.isEmpty(), false);
  queue.dequeue();
  assert.strictEqual(queue.isEmpty(), true);
});

test('Queue: includes', () => {
  const queue = new Queue();
  queue.enqueue(1);
  queue.enqueue(2);
  assert.strictEqual(queue.includes(1), true);
  assert.strictEqual(queue.includes(3), false);
});

test('Queue: clear', () => {
  const queue = new Queue();
  queue.enqueue(1);
  queue.enqueue(2);
  queue.clear();
  assert.strictEqual(queue.size, 0);
  assert.strictEqual(queue.isEmpty(), true);
});

test('Queue: toArray', () => {
  const queue = new Queue();
  queue.enqueue(1);
  queue.enqueue(2);
  queue.enqueue(3);
  const arr = queue.toArray();
  assert.deepStrictEqual(arr, [1, 2, 3]);
  arr.push(99);
  assert.strictEqual(queue.size, 3);
});

test('Queue: fromArray', () => {
  const queue = Queue.fromArray([1, 2, 3]);
  assert.strictEqual(queue.size, 3);
  assert.strictEqual(queue.dequeue(), 1);
  assert.strictEqual(queue.dequeue(), 2);
});

test('Queue: Symbol.iterator', () => {
  const queue = Queue.fromArray([1, 2, 3]);
  assert.deepStrictEqual([...queue], [1, 2, 3]);
  assert.strictEqual(queue.size, 3);
});

test('Queue: interleave enqueue and dequeue', () => {
  const queue = new Queue();
  queue.enqueue('a');
  queue.enqueue('b');
  assert.strictEqual(queue.dequeue(), 'a');
  queue.enqueue('c');
  assert.strictEqual(queue.dequeue(), 'b');
  assert.strictEqual(queue.dequeue(), 'c');
  assert.strictEqual(queue.dequeue(), undefined);
});
