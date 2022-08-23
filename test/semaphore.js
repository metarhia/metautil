'use strict';

const metatests = require('metatests');
const { Semaphore, delay } = require('..');

const CONCURRENCY = 3;
const QUEUE_SIZE = 4;
const TIMEOUT = 1500;

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

metatests.test('Semaphore real life usage', async (test) => {
  const semaphore = new Semaphore(CONCURRENCY, QUEUE_SIZE, TIMEOUT);

  const useSemaphore = async () => {
    try {
      await semaphore.enter();
    } catch (e) {
      return;
    }
    try {
      await delay(1000);
      return;
    } catch (e) {
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
  test.strictSame(semaphore.empty, true);
  test.strictSame(semaphore.queue.length, 0);
  test.strictSame(semaphore.counter, CONCURRENCY);
  test.end();
});

metatests.test('Semaphore detailed counter fix test', async (test) => {
  const semaphore = new Semaphore(CONCURRENCY, QUEUE_SIZE, TIMEOUT);
  await semaphore.enter();
  await semaphore.enter();
  await semaphore.enter();
  test.strictSame(semaphore.counter, 0);

  semaphore.enter().then(() => {
    test.assert(true);
  });
  semaphore.enter().catch((err) => {
    test.strictSame(err.message, 'Semaphore timeout');
  });
  semaphore.enter().catch((err) => {
    test.strictSame(err.message, 'Semaphore timeout');
  });
  semaphore.enter().catch((err) => {
    test.strictSame(err.message, 'Semaphore timeout');
  });
  test.strictSame(semaphore.queue.length, QUEUE_SIZE);

  await semaphore
    .enter()
    .catch((err) => test.strictSame(err.message, 'Semaphore queue is full'));

  semaphore.leave();

  setTimeout(() => {
    test.strictSame(semaphore.counter, 0);
  }, TIMEOUT + 200);
});
