'use strict';

const test = require('node:test');
const assert = require('node:assert');

const metautil = require('..');
const { toBool, timeout, delay, timeoutify } = metautil;
const { throttle, debounce } = metautil;

test('Async: toBool', async () => {
  const success = await Promise.resolve('success').then(...toBool);
  assert.strictEqual(success, true);
  const rejected = await Promise.reject(new Error('Ups')).then(...toBool);
  assert.strictEqual(rejected, false);
});

const TIMEOUT_ERROR = { code: 'ETIMEOUT', message: 'Timeout of 10ms reached' };

test('Async: Abortable timeout', async () => {
  await assert.rejects(timeout(10), TIMEOUT_ERROR);
  const ac = new AbortController();
  setTimeout(() => {
    ac.abort();
  }, 10);
  await assert.rejects(timeout(100, ac.signal), {
    name: 'AbortError',
    message: 'Timeout aborted',
  });
});

test('Async: Already aborted timeout', async () => {
  const ac = new AbortController();
  ac.abort();
  await assert.rejects(timeout(100, ac.signal), {
    name: 'AbortError',
    message: 'Timeout aborted',
  });
});

test('Async: Abortable delay', async () => {
  assert.strictEqual(await delay(10), undefined);
  const ac = new AbortController();
  setTimeout(() => {
    ac.abort();
  }, 10);
  await assert.rejects(delay(100, ac.signal), {
    name: 'AbortError',
    message: 'Delay aborted',
  });
});

test('Async: Already aborted delay', async () => {
  const ac = new AbortController();
  ac.abort();
  await assert.rejects(delay(100, ac.signal), {
    name: 'AbortError',
    message: 'Delay aborted',
  });
});

test('Async: timeoutify', async () => {
  await assert.rejects(timeoutify(delay(1000), 10), TIMEOUT_ERROR);
  assert.strictEqual(await timeoutify(delay(10), 1000), undefined);
});

test('Async: throttle leading call', () => {
  const calls = [];
  const { fn: throttled, cancel } = throttle((...args) => {
    calls.push(args);
  }, 50);

  throttled('a');
  throttled('b');
  throttled('c');

  assert.deepStrictEqual(calls, [['a']]);
  cancel();
});

test('Async: throttle trailing with latest args', async () => {
  const calls = [];
  const { fn: throttled, cancel } = throttle((...args) => {
    calls.push(args);
  }, 20);

  throttled(1);
  throttled(2);
  throttled(3);
  assert.deepStrictEqual(calls, [[1]]);

  await delay(30);
  assert.deepStrictEqual(calls, [[1], [3]]);
  cancel();
});

test('Async: throttle single call has no trailing', async () => {
  let count = 0;
  const { fn: throttled, cancel } = throttle(() => {
    count++;
  }, 20);

  throttled();
  assert.strictEqual(count, 1);
  await delay(30);
  assert.strictEqual(count, 1);
  cancel();
});

test('Async: throttle cancel drops trailing', async () => {
  let count = 0;
  const { fn: throttled, cancel } = throttle(() => {
    count++;
  }, 20);

  throttled();
  throttled();
  assert.strictEqual(count, 1);
  cancel();
  await delay(30);
  assert.strictEqual(count, 1);
});

test('Async: throttle continuous windows', async () => {
  const calls = [];
  const { fn: throttled, cancel } = throttle((...args) => {
    calls.push(args);
  }, 20);

  throttled('a');
  throttled('b');
  await delay(30);
  await delay(30);
  throttled('c');
  throttled('d');
  await delay(30);
  assert.deepStrictEqual(calls, [['a'], ['b'], ['c'], ['d']]);
  cancel();
});

test('Async: throttle flush', () => {
  const calls = [];
  const {
    fn: throttled,
    flush,
    cancel,
  } = throttle((...args) => {
    calls.push(args);
  }, 50);

  flush();
  assert.deepStrictEqual(calls, []);

  throttled(1);
  throttled(2);
  assert.deepStrictEqual(calls, [[1]]);
  flush();
  assert.deepStrictEqual(calls, [[1], [2]]);
  flush();
  assert.deepStrictEqual(calls, [[1], [2]]);
  cancel();
});

test('Async: debounce waits for quiet period', async () => {
  const calls = [];
  const { fn: debounced, cancel } = debounce((...args) => {
    calls.push(args);
  }, 20);

  debounced(1);
  debounced(2);
  debounced(3);
  assert.deepStrictEqual(calls, []);

  await delay(30);
  assert.deepStrictEqual(calls, [[3]]);
  cancel();
});

test('Async: debounce cancel prevents call', async () => {
  let count = 0;
  const { fn: debounced, cancel } = debounce(() => {
    count++;
  }, 20);

  debounced();
  cancel();
  await delay(30);
  assert.strictEqual(count, 0);
});

test('Async: debounce flush', () => {
  const calls = [];
  const {
    fn: debounced,
    flush,
    cancel,
  } = debounce((...args) => {
    calls.push(args);
  }, 50);

  flush();
  assert.deepStrictEqual(calls, []);

  debounced(1);
  debounced(2);
  assert.deepStrictEqual(calls, []);
  flush();
  assert.deepStrictEqual(calls, [[2]]);
  flush();
  assert.deepStrictEqual(calls, [[2]]);
  cancel();
});

test('Async: debounce resets quiet period', async () => {
  const calls = [];
  const { fn: debounced, cancel } = debounce((...args) => {
    calls.push(args);
  }, 40);

  debounced(1);
  await delay(20);
  debounced(2);
  await delay(20);
  assert.deepStrictEqual(calls, []);
  await delay(30);
  assert.deepStrictEqual(calls, [[2]]);
  cancel();
});
