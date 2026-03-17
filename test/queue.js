'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { UnrolledQueue } = require('..');

test('Queue: common use case', () => {
  const q = new UnrolledQueue({ nodeSize: 2 });
  assert.equal(q.length, 0);
  q.enqueue({ id: 1 });
  assert.equal(q.length, 1);
  q.enqueue({ id: 2 });
  assert.equal(q.length, 2);
  q.enqueue({ id: 3 });
  assert.equal(q.length, 3);
  assert.equal(q.dequeue().id, 1);
  assert.equal(q.length, 2);
  assert.equal(q.dequeue().id, 2);
  assert.equal(q.length, 1);
  q.enqueue({ id: 4 });
  assert.equal(q.length, 2);
});

test('Queue: dequeue on empty queue', () => {
  const q = new UnrolledQueue({ nodeSize: 2 });
  assert.equal(q.dequeue(), null);
  assert.equal(q.length, 0);
});

test('Queue: enqueue null and undefined', () => {
  const q = new UnrolledQueue({ nodeSize: 2 });
  assert.equal(q.length, 0);
  q.enqueue(null);
  assert.equal(q.length, 1);
  q.enqueue(undefined);
  assert.equal(q.length, 2);
  assert.equal(q.dequeue(), null);
  assert.equal(q.length, 1);
  assert.equal(q.dequeue(), undefined);
  assert.equal(q.length, 0);
  assert.equal(q.dequeue(), null);
  assert.equal(q.length, 0);
});

test('Queue: data integrity under intensive read/write', () => {
  const q = new UnrolledQueue({ nodeSize: 128 });
  const count = 100_000;
  for (let i = 0; i < count; i++) {
    q.enqueue(i);
  }
  for (let i = 0; i < count; i++) {
    const item = q.dequeue();
    assert.equal(item, i);
  }
  assert.equal(q.length, 0);
});

test('Queue: performance', () => {
  const q = new UnrolledQueue({ nodeSize: 1024 });
  const count = 1_000_000;
  const start = process.hrtime.bigint();
  for (let i = 0; i < count; i++) {
    q.enqueue(i);
  }
  for (let i = 0; i < count; i++) {
    const item = q.dequeue();
    assert.equal(item, i);
  }
  const end = process.hrtime.bigint();
  const elapsedMs = Number(end - start) / 1e6;
  assert.ok(elapsedMs < 100, `Test took too long: ${elapsedMs}ms`);
});

test('Queue: check node overflow', () => {
  const q = new UnrolledQueue({ nodeSize: 4 });

  for (let i = 0; i < 1000; i++) {
    q.enqueue(i);
    q.enqueue(i);
    q.dequeue();
  }

  assert.equal(q.length, 1000);

  for (let i = 0; i < 1000; i++) {
    const item = q.dequeue();
    assert.equal(typeof item, 'number');
  }

  assert.equal(q.dequeue(), null);
  assert.equal(q.length, 0);
});
