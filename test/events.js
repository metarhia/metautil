'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');

test('Emitter basic functionality', async () => {
  const ee = new metautil.Emitter();
  let onCount = 0;
  let onceCount = 0;

  ee.on('eventA', (data) => {
    assert.strictEqual(data, 'value');
    onCount++;
  });

  ee.once('eventA', (data) => {
    assert.strictEqual(data, 'value');
    onceCount++;
  });

  await ee.emit('eventA', 'value');
  await ee.emit('eventA', 'value');

  assert.strictEqual(onCount, 2);
  assert.strictEqual(onceCount, 1);
  assert.strictEqual(ee.listenerCount('eventA'), 1);
  assert.strictEqual(ee.listenerCount('eventB'), 0);
});

test('Emitter add/remove listeners', async () => {
  const ee = new metautil.Emitter();
  let callCount = 0;
  const listener = () => {
    callCount++;
  };

  ee.on('eventB', listener);
  await ee.emit('eventB', 'data');
  assert.strictEqual(callCount, 1);

  assert.strictEqual(ee.listenerCount('eventB'), 1);
  ee.off('eventB', listener);
  assert.strictEqual(ee.listenerCount('eventB'), 0);

  await ee.emit('eventB', 'data');
  assert.strictEqual(callCount, 1);
});

test('Emitter clear listeners', async () => {
  const ee = new metautil.Emitter();
  ee.on('eventC', () => {});
  ee.on('eventD', () => {});

  assert.strictEqual(ee.listenerCount('eventC'), 1);
  assert.strictEqual(ee.listenerCount('eventD'), 1);

  ee.clear('eventC');
  assert.strictEqual(ee.listenerCount('eventC'), 0);
  assert.strictEqual(ee.listenerCount('eventD'), 1);

  ee.clear();
  assert.strictEqual(ee.listenerCount('eventD'), 0);
});

test('Emitter toPromise', async () => {
  const ee = new metautil.Emitter();
  setTimeout(() => ee.emit('eventE', 'resolved'), 50);

  const result = await ee.toPromise('eventE');
  assert.strictEqual(result, 'resolved');

  assert.strictEqual(ee.listenerCount('eventE'), 0);
});

test('Emitter.toAsyncIterable basic', async () => {
  const ee = new metautil.Emitter();

  process.nextTick(async () => {
    await ee.emit('eventF', 'apple');
    await ee.emit('eventF', 'banana');
    await ee.emit('eventF', 'cherry');
  });

  const expectedValues = ['apple', 'banana', 'cherry'];
  for await (const value of ee.toAsyncIterable('eventF')) {
    assert.strictEqual(value, expectedValues.shift());
    if (!expectedValues.length) break;
  }

  assert.strictEqual(ee.listenerCount('eventF'), 0);
});

test('Emitter.toAsyncIterable with errors', async () => {
  const ee = new metautil.Emitter();
  const expectedError = new Error('Test error');

  process.nextTick(() => {
    ee.emit('error', expectedError);
    ee.emit('eventG', 'data');
  });

  let receivedError = null;
  try {
    for await (const item of ee.toAsyncIterable('eventG')) {
      assert.ok(item);
    }
  } catch (err) {
    receivedError = err;
  }

  assert.strictEqual(receivedError, expectedError);
  assert.strictEqual(ee.listenerCount('eventG'), 0);
  assert.strictEqual(ee.listenerCount('error'), 0);
});

test('Emitter.toAsyncIterable with delayed error', async () => {
  const ee = new metautil.Emitter();
  const error = new Error('Delayed error');

  process.nextTick(async () => {
    await ee.emit('eventH', 42);
    await ee.emit('error', error);
  });

  let receivedError = null;
  try {
    for await (const value of ee.toAsyncIterable('eventH')) {
      assert.strictEqual(value, 42);
    }
  } catch (err) {
    receivedError = err;
  }

  assert.strictEqual(receivedError, error);
  assert.strictEqual(ee.listenerCount('eventH'), 0);
  assert.strictEqual(ee.listenerCount('error'), 0);
});

test('Emitter.toAsyncIterable throws inside loop', async () => {
  const ee = new metautil.Emitter();
  const testError = new Error('Loop error');

  process.nextTick(() => {
    ee.emit('eventI', 99);
  });

  let receivedError = null;
  try {
    for await (const value of ee.toAsyncIterable('eventI')) {
      assert.strictEqual(value, 99);
      throw testError;
    }
  } catch (err) {
    receivedError = err;
  }

  assert.strictEqual(receivedError, testError);
  assert.strictEqual(ee.listenerCount('eventI'), 0);
});

test('Emitter.toAsyncIterable iterator control', async () => {
  const ee = new metautil.Emitter();
  const iterable = ee.toAsyncIterable('eventJ');
  const iterator = iterable[Symbol.asyncIterator]();

  process.nextTick(async () => {
    await ee.emit('eventJ', 'first');
    await ee.emit('eventJ', 'second');
    iterator.return();
  });

  const first = await iterator.next();
  const second = await iterator.next();
  const third = await iterator.next();
  const results = [first, second, third];

  assert.deepStrictEqual(results, [
    { value: 'first', done: false },
    { value: 'second', done: false },
    { value: undefined, done: true },
  ]);

  const data = await iterator.next();
  assert.deepStrictEqual(data, { value: undefined, done: true });
});
