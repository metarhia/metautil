'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');
const { toBool, timeout, delay } = metautil;
const { timeoutify, throttle, debounce } = metautil;
const { callbackify, asyncify, promisify } = metautil;

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

test('Async: throttle', async () => {
  const { promise, resolve } = Promise.withResolvers();
  let callCount = 0;

  const fn = (arg1, arg2, ...otherArgs) => {
    assert.strictEqual(arg1, 'someVal');
    assert.strictEqual(arg2, 4);
    assert.deepEqual(otherArgs, []);
    callCount++;
    assert.ok(callCount <= 2);
    if (callCount === 2) resolve();
  };

  const throttledFn = throttle(1, fn, 'someVal', 4);

  throttledFn();
  assert.strictEqual(callCount, 1);
  throttledFn();
  assert.strictEqual(callCount, 1);
  throttledFn();
  assert.strictEqual(callCount, 1);
  return promise;
});

test('Async: throttle merge args', async () => {
  const { promise, resolve } = Promise.withResolvers();
  let callCount = 0;

  const fn = (arg1, arg2, ...otherArgs) => {
    assert.strictEqual(arg1, 'someVal');
    assert.strictEqual(arg2, 4);
    assert.deepEqual(otherArgs, ['str']);
    callCount++;
    assert.ok(callCount <= 2);
    if (callCount === 2) resolve();
  };

  const throttledFn = throttle(1, fn, 'someVal', 4);

  throttledFn('str');
  assert.strictEqual(callCount, 1);
  throttledFn('str');
  assert.strictEqual(callCount, 1);
  throttledFn('str');
  assert.strictEqual(callCount, 1);
  return promise;
});

test('Async: throttle without arguments', async () => {
  const { promise, resolve } = Promise.withResolvers();
  let callCount = 0;

  const fn = (...args) => {
    assert.deepEqual(args, []);
    callCount++;
    assert.ok(callCount <= 2);
    if (callCount === 2) resolve();
  };

  const throttledFn = throttle(1, fn);

  throttledFn();
  assert.strictEqual(callCount, 1);
  throttledFn();
  assert.strictEqual(callCount, 1);
  throttledFn();
  assert.strictEqual(callCount, 1);
  return promise;
});

test('Async: debounce', async () => {
  const { promise, resolve } = Promise.withResolvers();
  let count = 0;

  const fn = (arg1, arg2, ...otherArgs) => {
    assert.strictEqual(arg1, 'someVal');
    assert.strictEqual(arg2, 4);
    assert.deepEqual(otherArgs, []);
    count++;
    assert.strictEqual(count, 1);
    resolve();
  };

  const debouncedFn = debounce(1, fn, 'someVal', 4);

  debouncedFn();
  assert.strictEqual(count, 0);
  debouncedFn();
  assert.strictEqual(count, 0);
  return promise;
});

test('Async: debounce without arguments', async () => {
  const { promise, resolve } = Promise.withResolvers();
  let count = 0;

  const fn = (...args) => {
    assert.deepEqual(args, []);
    count++;
    assert.strictEqual(count, 1);
    resolve();
  };

  const debouncedFn = debounce(1, fn);

  debouncedFn();
  assert.strictEqual(count, 0);
  debouncedFn();
  assert.strictEqual(count, 0);
  return promise;
});

test('Callbackify: Promise to callback-last', async () => {
  const { promise, resolve } = Promise.withResolvers();

  const promiseReturning = () => Promise.resolve('result');
  const asyncFn = callbackify(promiseReturning);

  asyncFn((err, value) => {
    assert.ifError(err);
    assert.strictEqual(value, 'result');
    resolve();
  });

  return promise;
});

test('Asyncify: sync function to callback-last', async () => {
  const { promise, resolve } = Promise.withResolvers();

  const fn = (par) => par;
  const asyncFn = asyncify(fn);

  asyncFn('result', (err, value) => {
    if (err) assert.ifError(err);
    assert.strictEqual(value, 'result');
    resolve();
  });

  return promise;
});

test('Promisify: callback-last to Promise', async () => {
  const id = 100;
  const data = { key: 'value' };

  const getDataAsync = (dataId, callback) => {
    assert.strictEqual(dataId, id);
    callback(null, data);
  };

  const getDataPromise = promisify(getDataAsync);

  try {
    const result = await getDataPromise(id);
    assert.strictEqual(result, data);
  } catch (err) {
    assert.ifError(err);
  }
});

test('Promisify: callback-last to Promise throw', async () => {
  const id = 100;

  const getDataAsync = (dataId, callback) => {
    assert.strictEqual(dataId, id);
    callback(new Error('Data not found'));
  };

  const getDataPromise = promisify(getDataAsync);

  try {
    const result = await getDataPromise(id);
    assert.notOk(result);
  } catch (err) {
    assert.ok(err);
  }
});
