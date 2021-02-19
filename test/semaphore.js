'use strict';

const metatests = require('metatests');
const { Semaphore } = require('..');

const CONCURRENCY = 3;
const QUEUE_SIZE = 10;
const TIMEOUT = 100;

const semaphore = new Semaphore(CONCURRENCY, QUEUE_SIZE, TIMEOUT);

metatests.test('Semaphore', async (test) => {
  await semaphore.enter();
  test.strictSame(semaphore.counter, CONCURRENCY - 1);
  await semaphore.enter();
  test.strictSame(semaphore.counter, CONCURRENCY - 2);
  await semaphore.enter();
  test.strictSame(semaphore.counter, 0);
  try {
    await semaphore.enter();
  } catch (err) {
    test.assert(err);
  }
  test.strictSame(semaphore.counter, 0);
  semaphore.leave();
  test.strictSame(semaphore.counter, CONCURRENCY - 2);
  semaphore.leave();
  test.strictSame(semaphore.counter, CONCURRENCY - 1);
  semaphore.leave();
  test.strictSame(semaphore.counter, CONCURRENCY);
  test.end();
});
