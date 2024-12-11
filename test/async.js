'use strict';

const test = require('node:test');
const assert = require('node:assert');
const {
  toBool,
  timeout,
  delay,
  timeoutify,
  throttle,
  debounce,
} = require('..');

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
  } catch (err) {
    assert.strictEqual(err.code, 'ETIMEOUT');
    assert.strictEqual(err.message, 'Timeout of 10ms reached');
  }
  const ac = new AbortController();
  setTimeout(() => {
    ac.abort();
  }, 10);
  try {
    await timeout(100, ac.signal);
    assert.ifError(new Error('Should not be executed'));
  } catch (err) {
    assert.strictEqual(err.message, 'Timeout aborted');
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
  } catch (err) {
    assert.strictEqual(err.message, 'Delay aborted');
  }
});

test('Async: timeoutify', async () => {
  try {
    const request = delay(1000);
    await timeoutify(request, 10);
    assert.ifError(new Error('Should not be executed'));
  } catch (err) {
    assert.strictEqual(err.code, 'ETIMEOUT');
    assert.strictEqual(err.message, 'Timeout of 10ms reached');
  }
  try {
    const request = delay(10);
    const response = await timeoutify(request, 1000);
    assert.strictEqual(response, undefined);
  } catch {
    assert.ifError(new Error('Should not be executed'));
  }
});

test('Async: throttle', () => {
  let callCount = 0;

  const fn = (arg1, arg2, ...otherArgs) => {
    assert.strictEqual(arg1, 'someVal');
    assert.strictEqual(arg2, 4);
    assert.strictEqual(otherArgs, []);
    callCount++;
  };

  const throttledFn = throttle(1, fn, 'someVal', 4);

  throttledFn();
  assert.strictEqual(callCount, 1);
  throttledFn();
  throttledFn();
  assert.strictEqual(callCount, 1);
});

test('Async: throttle merge args', () => {
  let callCount = 0;

  const fn = (arg1, arg2, ...otherArgs) => {
    assert.strictEqual(arg1, 'someVal');
    assert.strictEqual(arg2, 4);
    assert.strictEqual(otherArgs, ['str']);
    callCount++;
  };

  const throttledFn = throttle(1, fn, 'someVal', 4);

  throttledFn('str');
  assert.strictEqual(callCount, 1);
  throttledFn('str');
  throttledFn('str');
  assert.strictEqual(callCount, 1);
});

test('Async: throttle without arguments', () => {
  let callCount = 0;

  const fn = (...args) => {
    assert.strictEqual(args, []);
    callCount++;
  };

  const throttledFn = throttle(1, fn);

  throttledFn();
  assert.strictEqual(callCount, 1);
  throttledFn();
  throttledFn();
  assert.strictEqual(callCount, 1);
});

test('Async: debounce', async () => {
  const { promise, resolve } = Promise.withResolvers();
  let count = 0;

  const fn = (arg1, arg2, ...otherArgs) => {
    assert.strictEqual(arg1, 'someVal');
    assert.strictEqual(arg2, 4);
    assert.strictEqual(otherArgs, []);
    count++;
    resolve();
  };

  const debouncedFn = debounce(1, fn, 'someVal', 4);

  debouncedFn();
  debouncedFn();
  assert.strictEqual(count, 0);
  return promise;
});

test('Async: debounce without arguments', async () => {
  const { promise, resolve } = Promise.withResolvers();
  let count = 0;

  const fn = (...args) => {
    assert.strictEqual(args, []);
    count++;
    resolve();
  };

  const debouncedFn = debounce(1, fn);

  debouncedFn();
  debouncedFn();
  assert.strictEqual(count, 0);
  return promise;
});
