'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { Semaphore, delay } = require('..');

const concurrency = 3;
const queueLimit = 4;
const timeout = 1500;
const options = { concurrency, size: queueLimit, timeout };

test('Semaphore: constructor creates empty semaphore', () => {
  const semaphore = new Semaphore(options);

  assert.strictEqual(semaphore.concurrency, concurrency);
  assert.strictEqual(semaphore.available, concurrency);
  assert.strictEqual(semaphore.queueLimit, queueLimit);
  assert.strictEqual(semaphore.pending, 0);
  assert.strictEqual(semaphore.empty, true);
});

test('Semaphore: enter decreases available slots', async () => {
  const semaphore = new Semaphore(options);

  await semaphore.enter();
  assert.strictEqual(semaphore.available, concurrency - 1);
  assert.strictEqual(semaphore.empty, false);

  await semaphore.enter();
  assert.strictEqual(semaphore.available, concurrency - 2);
});

test('Semaphore: leave increases available slots', async () => {
  const semaphore = new Semaphore(options);

  await semaphore.enter();
  await semaphore.enter();
  semaphore.leave();
  assert.strictEqual(semaphore.available, concurrency - 1);

  semaphore.leave();
  assert.strictEqual(semaphore.available, concurrency);
  assert.strictEqual(semaphore.empty, true);
});

test('Semaphore: queue waits when concurrency is exhausted', async () => {
  const semaphore = new Semaphore(options);

  await semaphore.enter();
  await semaphore.enter();
  await semaphore.enter();

  const pending = semaphore.enter();
  assert.strictEqual(semaphore.available, 0);
  assert.strictEqual(semaphore.pending, 1);

  semaphore.leave();
  await pending;
  assert.strictEqual(semaphore.available, 0);
  assert.strictEqual(semaphore.pending, 0);
});

test('Semaphore: queue limit rejects extra waiters', async () => {
  const semaphore = new Semaphore(options);

  await semaphore.enter();
  await semaphore.enter();
  await semaphore.enter();

  for (let i = 0; i < queueLimit; i++) {
    void semaphore.enter().catch(() => {});
  }
  assert.strictEqual(semaphore.pending, queueLimit);

  await assert.rejects(semaphore.enter(), {
    message: 'Semaphore queue is full',
  });
});

test('Semaphore: timeout rejects queued waiter', async () => {
  const semaphore = new Semaphore(options);

  await semaphore.enter();
  await semaphore.enter();
  await semaphore.enter();

  await assert.rejects(semaphore.enter(), {
    message: 'Semaphore timeout',
  });
  assert.strictEqual(semaphore.pending, 0);
  assert.strictEqual(semaphore.available, 0);
  assert.strictEqual(semaphore.empty, false);
});

test('Semaphore: empty only without active entries and waiters', async () => {
  const semaphore = new Semaphore({ concurrency });

  assert.strictEqual(semaphore.empty, true);

  await semaphore.enter();
  assert.strictEqual(semaphore.empty, false);

  const pending = semaphore.enter();
  assert.strictEqual(semaphore.empty, false);

  semaphore.leave();
  await pending;
  assert.strictEqual(semaphore.empty, false);

  semaphore.leave();
  assert.strictEqual(semaphore.empty, true);
});

test('Semaphore: public mutable fields are not exposed', () => {
  const semaphore = new Semaphore(options);

  assert.strictEqual('counter' in semaphore, false);
  assert.strictEqual('size' in semaphore, false);
  assert.strictEqual('timeout' in semaphore, false);
  assert.strictEqual('queue' in semaphore, false);
  assert.strictEqual(typeof semaphore.concurrency, 'number');
  assert.strictEqual(typeof semaphore.available, 'number');
});

test('Semaphore: leave cannot overflow available slots', async () => {
  const semaphore = new Semaphore({ concurrency });

  semaphore.leave();
  semaphore.leave();
  assert.strictEqual(semaphore.available, concurrency);
  assert.strictEqual(semaphore.empty, true);

  await semaphore.enter();
  semaphore.leave();
  semaphore.leave();
  assert.strictEqual(semaphore.available, concurrency);
});

test('Semaphore: real life usage', async () => {
  const semaphore = new Semaphore(options);

  const useSemaphore = async () => {
    try {
      await semaphore.enter();
    } catch {
      return;
    }
    try {
      await delay(1000);
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
  assert.strictEqual(semaphore.pending, 0);
  assert.strictEqual(semaphore.available, concurrency);
});

test('Semaphore: detailed counter fix test', async () => {
  const semaphore = new Semaphore(options);

  await semaphore.enter();
  await semaphore.enter();
  await semaphore.enter();
  assert.strictEqual(semaphore.available, 0);

  semaphore.enter().then(() => {
    assert.ok(true);
  });
  semaphore.enter().catch((error) => {
    assert.strictEqual(error.message, 'Semaphore timeout');
  });
  semaphore.enter().catch((error) => {
    assert.strictEqual(error.message, 'Semaphore timeout');
  });
  semaphore.enter().catch((error) => {
    assert.strictEqual(error.message, 'Semaphore timeout');
  });
  assert.strictEqual(semaphore.pending, queueLimit);

  await assert.rejects(semaphore.enter(), {
    message: 'Semaphore queue is full',
  });

  semaphore.leave();

  setTimeout(() => {
    assert.strictEqual(semaphore.available, 0);
  }, timeout + 200);
});
