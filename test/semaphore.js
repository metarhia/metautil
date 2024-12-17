'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { Semaphore, delay } = require('..');

const concurrency = 3;
const size = 4;
const timeout = 1500;
const options = { concurrency, size, timeout };

test('Semaphore', async () => {
  const semaphore = new Semaphore(options);
  assert.strictEqual(semaphore.concurrency, concurrency);
  assert.strictEqual(semaphore.empty, true);
  await semaphore.enter();
  assert.strictEqual(semaphore.counter, concurrency - 1);
  assert.strictEqual(semaphore.empty, false);
  await semaphore.enter();
  assert.strictEqual(semaphore.counter, concurrency - 2);
  assert.strictEqual(semaphore.empty, false);
  await semaphore.enter();
  assert.strictEqual(semaphore.counter, 0);
  assert.strictEqual(semaphore.empty, false);
  try {
    await semaphore.enter();
  } catch (err) {
    assert(err);
  }
  assert.strictEqual(semaphore.counter, 0);
  assert.strictEqual(semaphore.empty, false);
  semaphore.leave();
  assert.strictEqual(semaphore.counter, concurrency - 2);
  assert.strictEqual(semaphore.empty, false);
  semaphore.leave();
  assert.strictEqual(semaphore.counter, concurrency - 1);
  assert.strictEqual(semaphore.empty, false);
  semaphore.leave();
  assert.strictEqual(semaphore.counter, concurrency);
  assert.strictEqual(semaphore.empty, true);
});

test('Semaphore default', async () => {
  const semaphore = new Semaphore({ concurrency });
  assert.strictEqual(semaphore.concurrency, concurrency);
  assert.strictEqual(semaphore.empty, true);
  await semaphore.enter();
  assert.strictEqual(semaphore.counter, concurrency - 1);
  assert.strictEqual(semaphore.empty, false);
  await semaphore.enter();
  assert.strictEqual(semaphore.counter, concurrency - 2);
  assert.strictEqual(semaphore.empty, false);
  await semaphore.enter();
  assert.strictEqual(semaphore.counter, 0);
  assert.strictEqual(semaphore.empty, false);
  try {
    await semaphore.enter();
  } catch (err) {
    assert(err);
  }
  assert.strictEqual(semaphore.counter, 0);
  assert.strictEqual(semaphore.empty, false);
  semaphore.leave();
  assert.strictEqual(semaphore.counter, concurrency - 2);
  assert.strictEqual(semaphore.empty, false);
  semaphore.leave();
  assert.strictEqual(semaphore.counter, concurrency - 1);
  assert.strictEqual(semaphore.empty, false);
  semaphore.leave();
  assert.strictEqual(semaphore.counter, concurrency);
  assert.strictEqual(semaphore.empty, true);
});

test('Semaphore timeout', async () => {
  const semaphore = new Semaphore(options);
  await semaphore.enter();
  await semaphore.enter();
  await semaphore.enter();
  assert.strictEqual(semaphore.counter, 0);
  assert.strictEqual(semaphore.queue.length, 0);
  assert.strictEqual(semaphore.empty, false);
  try {
    await semaphore.enter();
  } catch (err) {
    assert(err);
  }
  assert.strictEqual(semaphore.counter, 0);
  assert.strictEqual(semaphore.queue.length, 0);
  assert.strictEqual(semaphore.empty, false);
});

test('Semaphore real life usage', async () => {
  const semaphore = new Semaphore(options);

  const useSemaphore = async () => {
    try {
      await semaphore.enter();
    } catch {
      return;
    }
    try {
      await delay(1000);
      return;
    } catch {
      return;
    } finally {
      semaphore.leave();
    }
  };
  const promises = [];
  for (let index = 1; index <= 20; index++) {
    promises.push(useSemaphore());
  }
  await Promise.all(promises);
  assert.strictEqual(semaphore.empty, true);
  assert.strictEqual(semaphore.queue.length, 0);
  assert.strictEqual(semaphore.counter, concurrency);
});

test('Semaphore detailed counter fix test', async () => {
  const semaphore = new Semaphore(options);
  await semaphore.enter();
  await semaphore.enter();
  await semaphore.enter();
  assert.strictEqual(semaphore.counter, 0);

  semaphore.enter().then(() => {
    assert(true);
  });
  semaphore.enter().catch((err) => {
    assert.strictEqual(err.message, 'Semaphore timeout');
  });
  semaphore.enter().catch((err) => {
    assert.strictEqual(err.message, 'Semaphore timeout');
  });
  semaphore.enter().catch((err) => {
    assert.strictEqual(err.message, 'Semaphore timeout');
  });
  assert.strictEqual(semaphore.queue.length, size);

  await semaphore
    .enter()
    .catch((err) => assert.strictEqual(err.message, 'Semaphore queue is full'));

  semaphore.leave();

  setTimeout(() => {
    assert.strictEqual(semaphore.counter, 0);
  }, timeout + 200);
});
