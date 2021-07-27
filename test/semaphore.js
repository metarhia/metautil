'use strict';

const metatests = require('metatests');
const { Semaphore } = require('..');

const CONCURRENCY = 3;
const QUEUE_SIZE = 10;
const TIMEOUT = 100;

metatests.test('Semaphore', async (test) => {
  const semaphore = new Semaphore(CONCURRENCY, QUEUE_SIZE, TIMEOUT);
  test.strictSame(semaphore.concurrency, CONCURRENCY);
  test.strictSame(semaphore.empty, true);
  await semaphore.enter();
  test.strictSame(semaphore.counter, CONCURRENCY - 1);
  test.strictSame(semaphore.empty, false);
  await semaphore.enter();
  test.strictSame(semaphore.counter, CONCURRENCY - 2);
  test.strictSame(semaphore.empty, false);
  await semaphore.enter();
  test.strictSame(semaphore.counter, 0);
  test.strictSame(semaphore.empty, false);
  try {
    await semaphore.enter();
  } catch (err) {
    test.assert(err);
  }
  test.strictSame(semaphore.counter, 0);
  test.strictSame(semaphore.empty, false);
  semaphore.leave();
  test.strictSame(semaphore.counter, CONCURRENCY - 2);
  test.strictSame(semaphore.empty, false);
  semaphore.leave();
  test.strictSame(semaphore.counter, CONCURRENCY - 1);
  test.strictSame(semaphore.empty, false);
  semaphore.leave();
  test.strictSame(semaphore.counter, CONCURRENCY);
  test.strictSame(semaphore.empty, true);
  test.end();
});

metatests.test('Semaphore default', async (test) => {
  const semaphore = new Semaphore(CONCURRENCY);
  test.strictSame(semaphore.concurrency, CONCURRENCY);
  test.strictSame(semaphore.empty, true);
  await semaphore.enter();
  test.strictSame(semaphore.counter, CONCURRENCY - 1);
  test.strictSame(semaphore.empty, false);
  await semaphore.enter();
  test.strictSame(semaphore.counter, CONCURRENCY - 2);
  test.strictSame(semaphore.empty, false);
  await semaphore.enter();
  test.strictSame(semaphore.counter, 0);
  test.strictSame(semaphore.empty, false);
  try {
    await semaphore.enter();
  } catch (err) {
    test.assert(err);
  }
  test.strictSame(semaphore.counter, 0);
  test.strictSame(semaphore.empty, false);
  semaphore.leave();
  test.strictSame(semaphore.counter, CONCURRENCY - 2);
  test.strictSame(semaphore.empty, false);
  semaphore.leave();
  test.strictSame(semaphore.counter, CONCURRENCY - 1);
  test.strictSame(semaphore.empty, false);
  semaphore.leave();
  test.strictSame(semaphore.counter, CONCURRENCY);
  test.strictSame(semaphore.empty, true);
  test.end();
});

metatests.test('Semaphore timeout', async (test) => {
  const semaphore = new Semaphore(CONCURRENCY, QUEUE_SIZE, TIMEOUT);
  await semaphore.enter();
  await semaphore.enter();
  await semaphore.enter();
  test.strictSame(semaphore.counter, 0);
  test.strictSame(semaphore.queue.length, 0);
  test.strictSame(semaphore.empty, false);
  try {
    await semaphore.enter();
  } catch (err) {
    test.assert(err);
  }
  test.strictSame(semaphore.counter, 0);
  test.strictSame(semaphore.queue.length, 0);
  test.strictSame(semaphore.empty, false);
  test.end();
});
