'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');

const { UnrolledList } = metautil;

test('UnrolledList: enqueue and dequeue FIFO order', () => {
  const list = new UnrolledList();
  list.enqueue(1);
  list.enqueue(2);
  list.enqueue(3);
  assert.strictEqual(list.size, 3);
  assert.strictEqual(list.dequeue(), 1);
  assert.strictEqual(list.dequeue(), 2);
  assert.strictEqual(list.dequeue(), 3);
  assert.strictEqual(list.size, 0);
});

test('UnrolledList: dequeue empty returns undefined', () => {
  const list = new UnrolledList();
  assert.strictEqual(list.dequeue(), undefined);
  assert.strictEqual(list.size, 0);
});

test('UnrolledList: stores undefined and null items', () => {
  const list = new UnrolledList();
  list.enqueue(undefined);
  list.enqueue(null);
  list.enqueue(0);
  assert.strictEqual(list.size, 3);
  assert.strictEqual(list.dequeue(), undefined);
  assert.strictEqual(list.dequeue(), null);
  assert.strictEqual(list.dequeue(), 0);
});

test('UnrolledList: grows across nodes', () => {
  const list = new UnrolledList({ nodeSize: 2, poolSize: 2 });
  for (let i = 0; i < 5; i++) list.enqueue(i);
  assert.strictEqual(list.size, 5);
  for (let i = 0; i < 5; i++) {
    assert.strictEqual(list.dequeue(), i);
  }
  assert.strictEqual(list.size, 0);
  assert.strictEqual(list.dequeue(), undefined);
});

test('UnrolledList: reuses pooled nodes', () => {
  const list = new UnrolledList({ nodeSize: 2, poolSize: 2 });
  for (let i = 0; i < 6; i++) list.enqueue(i);
  for (let i = 0; i < 6; i++) assert.strictEqual(list.dequeue(), i);
  for (let i = 10; i < 16; i++) list.enqueue(i);
  assert.strictEqual(list.size, 6);
  for (let i = 10; i < 16; i++) {
    assert.strictEqual(list.dequeue(), i);
  }
  assert.strictEqual(list.size, 0);
});

test('UnrolledList: interleave enqueue and dequeue', () => {
  const list = new UnrolledList({ nodeSize: 3, poolSize: 1 });
  list.enqueue('a');
  list.enqueue('b');
  assert.strictEqual(list.dequeue(), 'a');
  list.enqueue('c');
  list.enqueue('d');
  assert.strictEqual(list.dequeue(), 'b');
  assert.strictEqual(list.dequeue(), 'c');
  assert.strictEqual(list.dequeue(), 'd');
  assert.strictEqual(list.dequeue(), undefined);
});

test('UnrolledList: single-node refill after empty', () => {
  const list = new UnrolledList({ nodeSize: 4 });
  list.enqueue(1);
  list.enqueue(2);
  assert.strictEqual(list.dequeue(), 1);
  assert.strictEqual(list.dequeue(), 2);
  assert.strictEqual(list.size, 0);
  list.enqueue(3);
  list.enqueue(4);
  assert.strictEqual(list.dequeue(), 3);
  assert.strictEqual(list.dequeue(), 4);
});

test('UnrolledList: default options', () => {
  const list = new UnrolledList();
  assert.strictEqual(list.size, 0);
  list.enqueue('x');
  assert.strictEqual(list.dequeue(), 'x');
});
