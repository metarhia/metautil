'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');
const {
  toBool,
  timeout,
  delay,
  timeoutify,
  throttle,
  debounce,
  callbackify,
  promisify,
  asyncify,
} = metautil;

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

test('Async: throttle timing', async () => {
  let resolve = null;
  const promise = new Promise((r) => {
    resolve = r;
  });

  let callCount = 0;
  const fn = () => {
    callCount++;
    if (callCount === 2) resolve();
  };

  const throttledFn = throttle(fn, 50);

  throttledFn();
  assert.strictEqual(callCount, 1);

  await new Promise((r) => setTimeout(r, 60));
  throttledFn();
  assert.strictEqual(callCount, 2);

  return promise;
});

test('Async: throttle no args', async () => {
  let resolve = null;
  const promise = new Promise((r) => {
    resolve = r;
  });

  let callCount = 0;
  const fn = (...args) => {
    assert.deepEqual(args, []);
    callCount++;
    if (callCount === 2) resolve();
  };

  const throttledFn = throttle(fn, 50);

  throttledFn();
  assert.strictEqual(callCount, 1);

  await new Promise((r) => setTimeout(r, 60));

  throttledFn();
  assert.strictEqual(callCount, 2);

  return promise;
});

test('Async: throttle with invalid intervals', async () => {
  const fn = () => {};
  assert.throws(() => throttle(fn, -1), {
    name: 'Error',
    message: 'Interval must be greater then 0',
  });
  assert.throws(() => throttle(fn, null), {
    name: 'Error',
    message: 'Interval must be greater then 0',
  });
  assert.throws(() => throttle(fn, undefined), {
    name: 'Error',
    message: 'Interval must be greater then 0',
  });
});

test('Async: throttle timing verification', async () => {
  let resolve = null;
  const promise = new Promise((r) => {
    resolve = r;
  });

  let lastCallTime = 0;
  let callCount = 0;
  const interval = 100;

  const fn = () => {
    const now = Date.now();
    if (lastCallTime) {
      assert.ok(now - lastCallTime >= interval);
    }
    lastCallTime = now;
    callCount++;
    if (callCount === 3) resolve();
  };

  const throttledFn = throttle(fn, interval);

  throttledFn();
  await new Promise((r) => setTimeout(r, interval + 10));
  throttledFn();
  await new Promise((r) => setTimeout(r, interval + 10));
  throttledFn();

  return promise;
});

test('Async: throttle error propagation', async () => {
  const errorFn = () => {
    throw new Error('Test error');
  };

  const throttledFn = throttle(errorFn, 1);
  assert.throws(() => throttledFn(), Error);
});

test('Async: debounce', async () => {
  let resolve = null;
  const promise = new Promise((r) => {
    resolve = r;
  });

  let count = 0;

  const fn = (arg1, arg2, ...otherArgs) => {
    assert.strictEqual(arg1, 'someVal');
    assert.strictEqual(arg2, 4);
    assert.deepEqual(otherArgs, []);
    count++;
    assert.strictEqual(count, 1);
    resolve();
  };

  const debouncedFn = debounce(fn, 1, 'someVal', 4);

  debouncedFn();
  assert.strictEqual(count, 0);
  debouncedFn();
  assert.strictEqual(count, 0);
  return promise;
});

test('Async: debounce (without arguments)', async () => {
  let resolve = null;
  const promise = new Promise((r) => {
    resolve = r;
  });

  let count = 0;

  const fn = (...args) => {
    assert.deepEqual(args, []);
    count++;
    assert.strictEqual(count, 1);
    resolve();
  };

  const debouncedFn = debounce(fn, 1);

  debouncedFn();
  assert.strictEqual(count, 0);
  debouncedFn();
  assert.strictEqual(count, 0);
  return promise;
});

test('Async: debounce (multiple calls)', () => {
  let resolve = null;
  const promise = new Promise((r) => {
    resolve = r;
  });

  let counter = 0;
  const increment = () => {
    counter++;
    resolve();
  };
  const debouncedFn = debounce(increment, 100);

  debouncedFn();
  debouncedFn();
  debouncedFn();

  assert.strictEqual(counter, 0);

  setTimeout(() => {
    assert.strictEqual(counter, 1);
  }, 150);

  return promise;
});

test('Async: debounce (preserves arguments)', () => {
  let resolve = null;
  const promise = new Promise((r) => {
    resolve = r;
  });

  let result = 0;
  const sum = (a, b) => {
    result = a + b;
    resolve();
  };
  const debouncedSum = debounce(sum, 100, 2, 3);

  debouncedSum();

  setTimeout(() => {
    assert.strictEqual(result, 5);
  }, 150);

  return promise;
});

test('Async: debounce (timing)', () => {
  let resolve = null;
  const promise = new Promise((r) => {
    resolve = r;
  });

  const start = Date.now();
  let executionTime;

  const fn = () => {
    executionTime = Date.now() - start;
    resolve();
  };

  const debouncedFn = debounce(fn, 100);
  debouncedFn();

  setTimeout(() => {
    assert(executionTime >= 100);
  }, 150);

  return promise;
});

test('Async: callbackify (validates callback parameter)', () => {
  const promiseReturning = () => Promise.resolve('test');
  const asyncFn = callbackify(promiseReturning);

  const nonFunctions = [null, undefined, 123, 'string', {}, [], true];
  nonFunctions.forEach((value) => {
    assert.throws(() => asyncFn(value), {
      name: 'Error',
      message: 'Last argument should be a function with 2 parameters',
    });
  });

  const wrongParamCallbacks = [
    () => {},
    // eslint-disable-next-line no-unused-vars
    (_err) => {},
    // eslint-disable-next-line no-unused-vars
    (_err, _val, _extra) => {},
  ];

  wrongParamCallbacks.forEach((callback) => {
    assert.throws(() => asyncFn(callback), {
      name: 'Error',
      message: 'Last argument should be a function with 2 parameters',
    });
  });

  assert.doesNotThrow(() => {
    // eslint-disable-next-line no-unused-vars
    asyncFn((_err, _result) => {});
  });
});

test(`Async: callbackify (resolved promise)`, async () => {
  let resolve = null;
  const promise = new Promise((r) => {
    resolve = r;
  });

  const promiseReturning = () => Promise.resolve('result');
  const asyncFn = callbackify(promiseReturning);

  asyncFn((err, value) => {
    assert.ifError(err);
    assert.strictEqual(value, 'result');
    resolve();
  });

  return promise;
});

test('Async: callbackify (rejected promise)', async () => {
  let resolve = null;
  const promise = new Promise((r) => {
    resolve = r;
  });

  const promiseReturning = () => Promise.reject(new Error('error'));
  const asyncFn = callbackify(promiseReturning);

  asyncFn((err, value) => {
    assert(err);
    assert.strictEqual(err.message, 'error');
    assert.strictEqual(value, undefined);
    resolve();
  });

  return promise;
});

test('Async: callbackify (async function with arguments)', async () => {
  let resolve = null;
  const promise = new Promise((r) => {
    resolve = r;
  });

  const promiseReturning = (arg) => Promise.resolve(arg);
  const asyncFn = callbackify(promiseReturning);

  asyncFn('test', (err, value) => {
    assert.ifError(err);
    assert.strictEqual(value, 'test');
    resolve();
  });

  return promise;
});

test('Async: callbackify (async function with multiple args)', async () => {
  let resolve = null;
  const promise = new Promise((r) => {
    resolve = r;
  });

  const promiseReturning = (arg1, arg2) => Promise.resolve(arg1 + arg2);
  const asyncFn = callbackify(promiseReturning);

  asyncFn(1, 2, (err, value) => {
    assert.ifError(err);
    assert.strictEqual(value, 3);
    resolve();
  });

  return promise;
});

test('Async: asyncify (handles sync fn execution asynchronously', async () => {
  let resolve = null;
  const promise = new Promise((r) => {
    resolve = r;
  });

  const syncFunction = (a, b) => a + b;

  const asyncFunction = asyncify(syncFunction);

  let result = null;
  let error = null;

  asyncFunction(2, 3, (err, res) => {
    error = err;
    result = res;
    resolve();
  });

  assert.strictEqual(result, null);
  assert.strictEqual(error, null);

  await promise;

  assert.strictEqual(error, null);
  assert.strictEqual(result, 5);
});

test('Async: asyncify (handles sync fn throwing an error)', async () => {
  let resolve = null;
  const promise = new Promise((r) => {
    resolve = r;
  });

  const syncFunction = () => {
    throw new Error('Test Error');
  };

  const asyncFunction = asyncify(syncFunction);

  let result = null;
  let error = null;

  asyncFunction((err, res) => {
    error = err;
    result = res;
    resolve();
  });

  assert.strictEqual(result, null);
  assert.strictEqual(error, null);

  await promise;

  assert.strictEqual(result, undefined);
  assert.strictEqual(error.message, 'Test Error');
});

test('Async: promisify (basic functionality)', async () => {
  const syncFn = (value, callback) => {
    callback(null, value);
  };
  const promisified = promisify(syncFn);

  try {
    const result = await promisified('test');
    assert.strictEqual(result, 'test');
  } catch (err) {
    assert.ifError(err);
  }
});

test('Async: promisify (handles errors)', async () => {
  const errorFn = (callback) => {
    callback(new Error('test error'));
  };
  const promisified = promisify(errorFn);

  try {
    await promisified();
    assert.fail('Should throw error');
  } catch (err) {
    assert.strictEqual(err.message, 'test error');
  }
});

test('Async: promisify (multiple arguments)', async () => {
  const sum = (a, b, callback) => {
    callback(null, a + b);
  };
  const promisified = promisify(sum);

  try {
    const result = await promisified(2, 3);
    assert.strictEqual(result, 5);
  } catch (err) {
    assert.ifError(err);
  }
});

test('Async: promisify (no arguments except callback)', async () => {
  const constantFn = (callback) => {
    callback(null, 42);
  };
  const promisified = promisify(constantFn);

  try {
    const result = await promisified();
    assert.strictEqual(result, 42);
  } catch (err) {
    assert.ifError(err);
  }
});

test('Async: promisify (complex return value)', async () => {
  const objFn = (callback) => {
    callback(null, { key: 'value', num: 123 });
  };
  const promisified = promisify(objFn);

  try {
    const result = await promisified();
    assert.deepStrictEqual(result, { key: 'value', num: 123 });
  } catch (err) {
    assert.ifError(err);
  }
});
