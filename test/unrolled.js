'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');

const { UnrolledList } = metautil;
const { UnrolledNode, NodePool } = require('../lib/unrolled.js');

test('UnrolledNode and NodePool are not package exports', () => {
  assert.strictEqual(metautil.UnrolledNode, undefined);
  assert.strictEqual(metautil.NodePool, undefined);
});

test('UnrolledNode: enqueue and dequeue FIFO order', () => {
  const node = new UnrolledNode(4);
  assert.strictEqual(node.enqueue(1), true);
  assert.strictEqual(node.enqueue(2), true);
  assert.strictEqual(node.enqueue(3), true);
  assert.strictEqual(node.length, 3);
  assert.strictEqual(node.dequeue(), 1);
  assert.strictEqual(node.dequeue(), 2);
  assert.strictEqual(node.dequeue(), 3);
  assert.strictEqual(node.length, 0);
});

test('UnrolledNode: enqueue full returns false', () => {
  const node = new UnrolledNode(2);
  assert.strictEqual(node.enqueue('a'), true);
  assert.strictEqual(node.enqueue('b'), true);
  assert.strictEqual(node.enqueue('c'), false);
  assert.strictEqual(node.length, 2);
  assert.strictEqual(node.dequeue(), 'a');
  assert.strictEqual(node.enqueue('c'), false);
  assert.strictEqual(node.length, 1);
});

test('UnrolledNode: dequeue empty returns undefined', () => {
  const node = new UnrolledNode(2);
  assert.strictEqual(node.dequeue(), undefined);
  assert.strictEqual(node.length, 0);
});

test('UnrolledNode: stores undefined and null items', () => {
  const node = new UnrolledNode(3);
  node.enqueue(undefined);
  node.enqueue(null);
  node.enqueue(0);
  assert.strictEqual(node.dequeue(), undefined);
  assert.strictEqual(node.dequeue(), null);
  assert.strictEqual(node.dequeue(), 0);
});

test('UnrolledNode: reset after drain allows reuse', () => {
  const node = new UnrolledNode(2);
  node.enqueue(1);
  node.enqueue(2);
  node.dequeue();
  node.dequeue();
  node.next = node;
  node.reset();
  assert.strictEqual(node.length, 0);
  assert.strictEqual(node.readIndex, 0);
  assert.strictEqual(node.writeIndex, 0);
  assert.strictEqual(node.next, null);
  assert.strictEqual(node.enqueue(3), true);
  assert.strictEqual(node.dequeue(), 3);
});

test('UnrolledNode: clear drops remaining items', () => {
  const node = new UnrolledNode(2);
  node.enqueue('a');
  node.enqueue('b');
  node.dequeue();
  node.next = new UnrolledNode(2);
  node.clear();
  assert.strictEqual(node.length, 0);
  assert.strictEqual(node.readIndex, 0);
  assert.strictEqual(node.writeIndex, 0);
  assert.strictEqual(node.next, null);
  assert.strictEqual(node.buffer[0], undefined);
  assert.strictEqual(node.buffer[1], undefined);
  assert.strictEqual(node.enqueue('c'), true);
  assert.strictEqual(node.dequeue(), 'c');
});

test('NodePool: acquire uses prefilled instances then factory', () => {
  let created = 0;
  const pool = new NodePool(2, () => {
    created++;
    return { id: created };
  });
  assert.strictEqual(created, 2);
  const a = pool.acquire();
  const b = pool.acquire();
  assert.strictEqual(a.id, 1);
  assert.strictEqual(b.id, 2);
  const c = pool.acquire();
  assert.strictEqual(created, 3);
  assert.strictEqual(c.id, 3);
});

test('NodePool: release reuses instance under cap', () => {
  const pool = new NodePool(1, () => ({}));
  const a = pool.acquire();
  pool.release(a);
  const b = pool.acquire();
  assert.strictEqual(a, b);
});

test('NodePool: release drops instance at cap', () => {
  const pool = new NodePool(1, () => ({}));
  const a = pool.acquire();
  const extra = pool.acquire();
  pool.release(a);
  pool.release(extra);
  assert.strictEqual(pool.acquire(), a);
  assert.notStrictEqual(pool.acquire(), extra);
});

test('NodePool: count 0 never pools', () => {
  let created = 0;
  const pool = new NodePool(0, () => {
    created++;
    return created;
  });
  assert.strictEqual(created, 0);
  assert.strictEqual(pool.acquire(), 1);
  pool.release(1);
  assert.strictEqual(pool.acquire(), 2);
});

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

test('UnrolledList: peek does not remove element', () => {
  const list = new UnrolledList();
  list.enqueue(42);
  assert.strictEqual(list.peek(), 42);
  assert.strictEqual(list.size, 1);
  assert.strictEqual(list.peek(), 42);
});

test('UnrolledList: peek empty returns undefined', () => {
  const list = new UnrolledList();
  assert.strictEqual(list.peek(), undefined);
});

test('UnrolledList: peek after dequeue', () => {
  const list = new UnrolledList({ nodeSize: 2 });
  list.enqueue(1);
  list.enqueue(2);
  list.enqueue(3);
  assert.strictEqual(list.peek(), 1);
  assert.strictEqual(list.dequeue(), 1);
  assert.strictEqual(list.peek(), 2);
  assert.strictEqual(list.dequeue(), 2);
  assert.strictEqual(list.peek(), 3);
});

test('UnrolledList: peek stored undefined', () => {
  const list = new UnrolledList();
  list.enqueue(undefined);
  assert.strictEqual(list.peek(), undefined);
  assert.strictEqual(list.size, 1);
  assert.strictEqual(list.isEmpty(), false);
});

test('UnrolledList: isEmpty', () => {
  const list = new UnrolledList();
  assert.strictEqual(list.isEmpty(), true);
  list.enqueue(1);
  assert.strictEqual(list.isEmpty(), false);
  list.dequeue();
  assert.strictEqual(list.isEmpty(), true);
});

test('UnrolledList: clear', () => {
  const list = new UnrolledList();
  list.enqueue(1);
  list.enqueue(2);
  list.clear();
  assert.strictEqual(list.size, 0);
  assert.strictEqual(list.isEmpty(), true);
  assert.strictEqual(list.peek(), undefined);
  assert.strictEqual(list.dequeue(), undefined);
});

test('UnrolledList: clear across nodes then reuse', () => {
  const list = new UnrolledList({ nodeSize: 2, poolSize: 2 });
  for (let i = 0; i < 6; i++) list.enqueue(i);
  list.clear();
  assert.strictEqual(list.isEmpty(), true);
  list.enqueue('a');
  list.enqueue('b');
  list.enqueue('c');
  assert.strictEqual(list.size, 3);
  assert.strictEqual(list.peek(), 'a');
  assert.strictEqual(list.dequeue(), 'a');
  assert.strictEqual(list.dequeue(), 'b');
  assert.strictEqual(list.dequeue(), 'c');
  assert.strictEqual(list.dequeue(), undefined);
});

test('UnrolledList: clear empty', () => {
  const list = new UnrolledList();
  list.clear();
  assert.strictEqual(list.size, 0);
  assert.strictEqual(list.isEmpty(), true);
  list.enqueue(1);
  assert.strictEqual(list.dequeue(), 1);
});

test('UnrolledList: fromArray', () => {
  const list = UnrolledList.fromArray([1, 2, 3], { nodeSize: 2 });
  assert.strictEqual(list.size, 3);
  const empty = UnrolledList.fromArray([]);
  assert.strictEqual(empty.size, 0);
});
