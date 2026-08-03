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

test('Async: Abortable timeout', async () => {
  try {
    await timeout(10);
    assert.ifError(new Error('Should not be executed'));
  } catch (error) {
    assert.strictEqual(error.code, 'ETIMEOUT');
    assert.strictEqual(error.message, 'Timeout of 10ms reached');
  }
  const ac = new AbortController();
  setTimeout(() => {
    ac.abort();
  }, 10);
  try {
    await timeout(100, ac.signal);
    assert.ifError(new Error('Should not be executed'));
  } catch (error) {
    assert.strictEqual(error.name, 'AbortError');
    assert.strictEqual(error.message, 'Timeout aborted');
  }
});

test('Async: Already aborted timeout', async () => {
  const ac = new AbortController();
  ac.abort();
  try {
    await timeout(100, ac.signal);
    assert.ifError(new Error('Should not be executed'));
  } catch (error) {
    assert.strictEqual(error.name, 'AbortError');
    assert.strictEqual(error.message, 'Timeout aborted');
  }
});

test('Async: Abortable delay', async () => {
  try {
    const res = await delay(10);
    assert.strictEqual(res, undefined);
  } catch {
    assert.ifError(new Error('Should not be executed'));
  }
  const ac = new AbortController();
  setTimeout(() => {
    ac.abort();
  }, 10);
  try {
    await delay(100, ac.signal);
    assert.ifError(new Error('Should not be executed'));
  } catch (error) {
    assert.strictEqual(error.name, 'AbortError');
    assert.strictEqual(error.message, 'Delay aborted');
  }
});

test('Async: Already aborted delay', async () => {
  const ac = new AbortController();
  ac.abort();
  try {
    await delay(100, ac.signal);
    assert.ifError(new Error('Should not be executed'));
  } catch (error) {
    assert.strictEqual(error.name, 'AbortError');
    assert.strictEqual(error.message, 'Delay aborted');
  }
});

test('Async: timeoutify', async () => {
  try {
    const request = delay(1000);
    await timeoutify(request, 10);
    assert.ifError(new Error('Should not be executed'));
  } catch (error) {
    assert.strictEqual(error.code, 'ETIMEOUT');
    assert.strictEqual(error.message, 'Timeout of 10ms reached');
  }
  try {
    const request = delay(10);
    const response = await timeoutify(request, 1000);
    assert.strictEqual(response, undefined);
  } catch {
    assert.ifError(new Error('Should not be executed'));
  }
});

test('Async: throttle leading call', () => {
  let count = 0;
  const calls = [];
  const { fn: throttled, cancel } = throttle((...args) => {
    count++;
    calls.push(args);
  }, 50);

  throttled('a');
  throttled('b');
  throttled('c');

  assert.strictEqual(count, 1);
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
  const control = throttle((...args) => {
    calls.push(args);
  }, 50);
  const { fn: throttled, flush, cancel } = control;

  assert.strictEqual(typeof control.fn, 'function');
  assert.strictEqual(typeof control.cancel, 'function');
  assert.strictEqual(typeof control.flush, 'function');

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
  const control = debounce((...args) => {
    calls.push(args);
  }, 50);
  const { fn: debounced, flush, cancel } = control;

  assert.strictEqual(typeof control.fn, 'function');
  assert.strictEqual(typeof control.cancel, 'function');
  assert.strictEqual(typeof control.flush, 'function');

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
