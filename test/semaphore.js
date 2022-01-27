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

metatests.test('Semaphore real life usage', (test) => {
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

  for (let index = 1; index <= 20; index++) {
    useSemaphore();
  }

  setTimeout(() => {
    test.strictSame(semaphore.empty, true);
    test.strictSame(semaphore.queue.length, 0);
    test.strictSame(semaphore.counter, CONCURRENCY);
    test.end();
  }, TIMEOUT + 1000);
});

metatests.test('Semaphore detailed counter fix test', async (test) => {
  const semaphore = new Semaphore(CONCURRENCY, QUEUE_SIZE, TIMEOUT);
  // Enter semaphore 3 times to have concurrency = 0
  await semaphore.enter();
  await semaphore.enter();
  await semaphore.enter();
  // See current state of a Semaphore
  test.strictSame(semaphore.counter, 0);

  // Enter semaphore 4 times for queue to be full
  semaphore.enter().then(() => {
    // Entered successfully from queue
    test.assert(true);
  });
  semaphore.enter().catch((err) => {
    // expect timeout error to occur after TIMEOUT
    test.strictSame(err.message, 'Semaphore timeout');
  });
  semaphore.enter().catch((err) => {
    // expect timeout error to occur after TIMEOUT
    test.strictSame(err.message, 'Semaphore timeout');
  });
  semaphore.enter().catch((err) => {
    // expect timeout error to occur after TIMEOUT
    test.strictSame(err.message, 'Semaphore timeout');
  });
  // See current state of a Semaphore
  test.strictSame(semaphore.queue.length, QUEUE_SIZE);

  // Error semaphore is full
  await semaphore
    .enter()
    .catch((err) => test.strictSame(err.message, 'Semaphore queue is full'));

  // leave semaphore 1 time to free 1 operation from queue
  semaphore.leave();

  setTimeout(() => {
    // See current state of a Semaphore
    test.strictSame(semaphore.counter, 0);
    // we have concurrency = 0, because we left only One time
    // This is proper behaviour with fix, because we tried to enter 7 times
    // made only 4 successful enters. 3 times - number of concurrency
    // 1 time - after we leave 1 time and first enter from queue succeed
  }, TIMEOUT + 200);
});
