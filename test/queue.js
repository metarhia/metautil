'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { UnrolledQueue } = require('..');

test('Queue: dequeue on empty queue', () => {
  const q = new UnrolledQueue({ nodeSize: 2 });
  assert.equal(q.dequeue(), null);
  assert.equal(q.length, 0);
});

test('Queue: enqueue null and undefined', () => {
  const q = new UnrolledQueue({ nodeSize: 2 });
  q.enqueue(null);
  q.enqueue(undefined);
  assert.equal(q.dequeue(), null);
  assert.equal(q.dequeue(), undefined);
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
  const count = 500_000;
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
  console.log(`Performance test elapsed: ${elapsedMs.toFixed(2)}ms`);
  assert.ok(elapsedMs < 500, `Test took too long: ${elapsedMs}ms`);
});

test('Queue: simulated race with async', async () => {
  const q = new UnrolledQueue({ nodeSize: 128 });
  const totalItems = 10_000;
  const numProducers = 5;
  const numConsumers = 5;
  let produced = 0;
  let consumed = 0;
  const items = Array.from({ length: totalItems }, (_, i) => i);

  const producer = () =>
    new Promise((resolve) => {
      const interval = setInterval(() => {
        if (items.length) {
          const item = items.pop();
          q.enqueue(item);
          produced++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, 0);
    });

  const consumerResults = [];
  const consumer = () =>
    new Promise((resolve) => {
      const interval = setInterval(() => {
        const item = q.dequeue();
        if (item !== null) {
          consumerResults.push(item);
          consumed++;
        }
        if (produced === totalItems && q.isEmpty()) {
          clearInterval(interval);
          resolve();
        }
      }, 0);
    });

  const producers = Array.from({ length: numProducers }, () => producer());
  const consumers = Array.from({ length: numConsumers }, () => consumer());

  await Promise.all([...producers, ...consumers]);

  assert.equal(produced, totalItems);
  assert.equal(consumed, totalItems);
  consumerResults.sort((a, b) => a - b);
  for (let i = 0; i < totalItems; i++) {
    assert.equal(consumerResults[i], i);
  }
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

test('Queue: node does not write past buffer size', () => {
  const q = new UnrolledQueue({ nodeSize: 4 });

  const total = 40;
  for (let i = 0; i < total; i++) {
    q.enqueue(i);
    if (i % 2 === 0) q.dequeue(); // simulate "half-full" nodes
  }

  assert.equal(q.length, total / 2);

  const seen = new Set();
  while (!q.isEmpty()) {
    const val = q.dequeue();
    assert.ok(!seen.has(val), 'value should not repeat or be corrupted');
    seen.add(val);
  }

  assert.equal(q.length, 0);
  assert.equal(q.dequeue(), null);
});
