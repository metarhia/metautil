'use strict';

const test = require('node:test');
const assert = require('node:assert');

const { Semaphore, delay } = require('..');

const concurrency = 3;

test('Semaphore: enter and leave track counter and empty', async () => {
  const semaphore = new Semaphore({ concurrency });
  assert.strictEqual(semaphore.empty, true);
  for (let i = 1; i <= concurrency; i++) {
    await semaphore.enter();
    assert.strictEqual(semaphore.counter, concurrency - i);
    assert.strictEqual(semaphore.empty, false);
  }
  for (let i = 1; i <= concurrency; i++) {
    semaphore.leave();
    assert.strictEqual(semaphore.counter, i);
  }
  assert.strictEqual(semaphore.empty, true);
});

test('Semaphore: default size rejects when all slots are taken', async () => {
  const semaphore = new Semaphore({ concurrency: 1 });
  await semaphore.enter();
  await assert.rejects(semaphore.enter(), {
    message: 'Semaphore queue is full',
  });
  assert.strictEqual(semaphore.counter, 0);
  semaphore.leave();
  assert.strictEqual(semaphore.empty, true);
});

test('Semaphore timeout zero waits without rejecting', async () => {
  const semaphore = new Semaphore({ concurrency: 1, size: 2, timeout: 0 });
  await semaphore.enter();
  let entered = false;
  const waiting = semaphore.enter().then(() => {
    entered = true;
  });
  await delay(30);
  assert.strictEqual(entered, false);
  semaphore.leave();
  await waiting;
  assert.strictEqual(entered, true);
  semaphore.leave();
});

test('Semaphore timeout', async () => {
  const semaphore = new Semaphore({ concurrency: 1, size: 2, timeout: 20 });
  await semaphore.enter();
  await assert.rejects(semaphore.enter(), { message: 'Semaphore timeout' });
  assert.strictEqual(semaphore.counter, 0);
  assert.strictEqual(semaphore.queue.length, 0);
  assert.strictEqual(semaphore.empty, false);
});

test('Semaphore: hand-off, full queue, and waiter timeouts', async () => {
  const semaphore = new Semaphore({ concurrency: 1, size: 3, timeout: 50 });
  await semaphore.enter();
  const first = semaphore.enter();
  const rest = [semaphore.enter(), semaphore.enter()];
  assert.strictEqual(semaphore.queue.length, 3);
  await assert.rejects(semaphore.enter(), {
    message: 'Semaphore queue is full',
  });
  semaphore.leave();
  await first;
  const expected = { message: 'Semaphore timeout' };
  await Promise.all(rest.map((waiting) => assert.rejects(waiting, expected)));
  assert.strictEqual(semaphore.counter, 0);
  assert.strictEqual(semaphore.queue.length, 0);
});

test('Semaphore real life usage', async () => {
  const semaphore = new Semaphore({ concurrency, size: 4, timeout: 1500 });
  let completed = 0;
  let rejected = 0;
  const useSemaphore = async () => {
    try {
      await semaphore.enter();
    } catch {
      rejected++;
      return;
    }
    try {
      await delay(50);
      completed++;
    } finally {
      semaphore.leave();
    }
  };
  const promises = [];
  for (let index = 1; index <= 20; index++) {
    promises.push(useSemaphore());
  }
  await Promise.all(promises);
  assert.strictEqual(completed, 7);
  assert.strictEqual(rejected, 13);
  assert.strictEqual(semaphore.empty, true);
  assert.strictEqual(semaphore.queue.length, 0);
  assert.strictEqual(semaphore.counter, concurrency);
});
