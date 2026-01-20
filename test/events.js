'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { once } = require('node:events');
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
  let countC = 0;
  let countD = 0;

  ee.on('eventC', () => countC++);
  ee.on('eventD', () => countD++);

  assert.strictEqual(ee.listenerCount('eventC'), 1);
  assert.strictEqual(ee.listenerCount('eventD'), 1);

  ee.clear('eventC');
  assert.strictEqual(ee.listenerCount('eventC'), 0);
  assert.strictEqual(ee.listenerCount('eventD'), 1);

  ee.clear();
  assert.strictEqual(ee.listenerCount('eventD'), 0);
});

test('Emitter.toPromise', async () => {
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

test('Emitter handles multiple once()', async () => {
  const ee = new metautil.Emitter();
  let callCount = 0;

  ee.once('eventH', () => callCount++);
  ee.once('eventH', () => callCount++);

  await ee.emit('eventH', 'data');
  await ee.emit('eventH', 'data');

  assert.strictEqual(callCount, 2);
  assert.strictEqual(ee.listenerCount('eventH'), 0);
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

test('Emitter does not allow duplicate listeners', () => {
  const ee = new metautil.Emitter();
  const listener = () => {};

  ee.on('eventK', listener);
  assert.throws(() => {
    ee.on('eventK', listener);
  }, /Duplicate listeners detected/);
});

test('Emitter emits async & sync listeners', async () => {
  const ee = new metautil.Emitter();
  const results = [];

  ee.on('eventL', (data) => results.push(`sync:${data}`));
  ee.on('eventL', async (data) => {
    await new Promise((res) => setTimeout(res, 10));
    results.push(`async:${data}`);
  });

  await ee.emit('eventL', 'valueL');
  assert.deepStrictEqual(results, ['sync:valueL', 'async:valueL']);
});

test('Emitter.toAsyncIterable stops manually', async () => {
  const ee = new metautil.Emitter();
  const iterator = ee.toAsyncIterable('eventM')[Symbol.asyncIterator]();

  process.nextTick(async () => {
    await ee.emit('eventM', 'data1');
    await ee.emit('eventM', 'data2');
    iterator.return();
    await ee.emit('eventM', 'data3'); // Should not be received
  });

  const first = await iterator.next();
  assert.deepStrictEqual(first, { value: 'data1', done: false });

  const second = await iterator.next();
  assert.deepStrictEqual(second, { value: 'data2', done: false });

  const third = await iterator.next();
  assert.deepStrictEqual(third, { value: undefined, done: true });

  assert.strictEqual(ee.listenerCount('eventM'), 0);
});

test('Emitter unhandled error', async () => {
  const ee = new metautil.Emitter();

  let capturedError = null;
  try {
    await ee.emit('error', new Error('Test error'));
  } catch (err) {
    capturedError = err;
  }

  assert.strictEqual(capturedError.message, 'Unhandled error');
});

test('Emitter once() cleanup', async () => {
  const ee = new metautil.Emitter();
  let callCount = 0;
  const handler = () => callCount++;

  ee.once('eventK', handler);
  assert.strictEqual(ee.listenerCount('eventK'), 1);

  await ee.emit('eventK', 'test');
  assert.strictEqual(callCount, 1);
  assert.strictEqual(ee.listenerCount('eventK'), 0);
});

test('Emitter off() removes once()', async () => {
  const ee = new metautil.Emitter();
  let count = 0;
  const listener = () => count++;

  ee.once('eventL', listener);
  ee.off('eventL', listener);
  await ee.emit('eventL');

  assert.strictEqual(count, 0);
  assert.strictEqual(ee.listenerCount('eventL'), 0);
});

test('Emitter calls listeners order', async () => {
  const ee = new metautil.Emitter();
  const results = [];

  const e1 = () => results.push(1);
  const e2 = () => results.push(2);
  const e3 = () => results.push(3);
  const e4 = () => results.push(4);
  const e5 = () => results.push(5);
  const e6 = () => results.push(6);

  ee.on('eventM', e1);
  ee.on('eventM', e2);
  ee.on('eventM', e3);
  ee.once('eventM', e4);
  ee.once('eventM', e5);
  ee.once('eventM', e6);
  ee.off('eventM', e2);
  ee.off('eventM', e5);

  await ee.emit('eventM');

  ee.once('eventM', e5);
  ee.on('eventM', e2);

  await ee.emit('eventM');

  assert.deepStrictEqual(results, [1, 3, 4, 6, 1, 3, 5, 2]);
});

test('Emitter off while emitting', async () => {
  const ee = new metautil.Emitter();
  let count = 0;

  const listener = () => {
    count++;
    ee.off('eventN', listener);
  };

  ee.on('eventN', listener);
  ee.on('eventN', () => count++);

  await ee.emit('eventN', 'data');
  assert.strictEqual(count, 2);
});

test('Emitter once with max listeners error', () => {
  const ee = new metautil.Emitter({ maxListeners: 2 });
  const eventName = 'eventO';

  ee.on(eventName, () => {});
  ee.on(eventName, () => {});

  assert.throws(
    () => ee.once(eventName, () => {}),
    /MaxListenersExceededWarning/,
  );
  assert.strictEqual(ee.listenerCount(eventName), 3);
});

test('Stream constructor without iterable', async () => {
  const stream = new metautil.Stream(null, { objectMode: true });
  const results = [];

  stream.on('data', (chunk) => results.push(chunk));

  stream.push('first');
  stream.push('second');
  stream.push(null);

  await once(stream, 'end');

  assert.deepStrictEqual(results, ['first', 'second']);
});

test('Stream constructor with sync iterable', async () => {
  const data = ['apple', 'banana', 'cherry'];
  const stream = new metautil.Stream(data, { objectMode: true });
  const results = [];

  stream.on('data', (chunk) => results.push(chunk));

  await once(stream, 'end');

  assert.deepStrictEqual(results, ['apple', 'banana', 'cherry']);
});

test('Stream constructor with async iterable', async () => {
  async function* asyncGenerator() {
    yield 'one';
    await Promise.resolve(); // microtask delay
    yield 'two';
    await new Promise((resolve) => setTimeout(resolve, 10)); // small timeout
    yield 'three';
  }

  const stream = new metautil.Stream(asyncGenerator(), { objectMode: true });
  const results = [];

  stream.on('data', (chunk) => results.push(chunk));

  await once(stream, 'end');

  assert.deepStrictEqual(results, ['one', 'two', 'three']);
});

test('Stream.toEventEmitter basic', async () => {
  const stream = new metautil.Stream(null, { objectMode: true });
  const emitter = stream.toEventEmitter('data');
  const results = [];

  emitter.on('data', (chunk) => results.push(chunk));

  stream.push('hello');
  stream.push('world');
  stream.push(null);

  await once(emitter, 'end');

  assert.deepStrictEqual(results, ['hello', 'world']);
});

test('Stream.toEventEmitter with custom event name', async () => {
  const stream = new metautil.Stream(null, { objectMode: true });
  const emitter = stream.toEventEmitter('message');
  const results = [];

  emitter.on('message', (chunk) => results.push(chunk));

  stream.push('custom1');
  stream.push('custom2');
  stream.push(null);

  await once(emitter, 'end');

  assert.deepStrictEqual(results, ['custom1', 'custom2']);
});

test('Stream.toEventEmitter emits end event', async () => {
  const stream = new metautil.Stream(null, { objectMode: true });
  const emitter = stream.toEventEmitter('data');
  let endCalled = false;

  emitter.on('end', () => {
    endCalled = true;
  });

  stream.push('data');
  stream.push(null);

  await once(emitter, 'end');

  assert.strictEqual(endCalled, true);
});

test('Stream.toEventEmitter handles listener errors', async () => {
  const stream = new metautil.Stream(null, { objectMode: true });
  const emitter = stream.toEventEmitter('data');
  const testError = new Error('Listener error');

  emitter.on('data', () => {
    throw testError;
  });

  stream.push('trigger');
  stream.push(null);

  const [capturedError] = await once(emitter, 'error');

  assert.strictEqual(capturedError, testError);
});

test('Stream.toEventEmitter forwards stream errors', async () => {
  const stream = new metautil.Stream(null, { objectMode: true });
  const emitter = stream.toEventEmitter('data');
  const testError = new Error('Stream error');

  stream.destroy(testError);

  const [capturedError] = await once(emitter, 'error');

  assert.strictEqual(capturedError, testError);
});

test('Stream.toEventEmitter multiple listeners', async () => {
  const stream = new metautil.Stream(null, { objectMode: true });
  const emitter = stream.toEventEmitter('data');
  const results1 = [];
  const results2 = [];

  emitter.on('data', (chunk) => results1.push(`l1:${chunk}`));
  emitter.on('data', (chunk) => results2.push(`l2:${chunk}`));

  stream.push('item1');
  stream.push('item2');
  stream.push(null);

  await once(emitter, 'end');

  assert.deepStrictEqual(results1, ['l1:item1', 'l1:item2']);
  assert.deepStrictEqual(results2, ['l2:item1', 'l2:item2']);
});

test('Stream from Emitter async iterable', async () => {
  const ee = new metautil.Emitter();
  const iterable = ee.toAsyncIterable('eventStream');
  const stream = new metautil.Stream(iterable, { objectMode: true });
  const results = [];

  stream.on('data', (chunk) => results.push(chunk));

  process.nextTick(async () => {
    await ee.emit('eventStream', 'val1');
    await ee.emit('eventStream', 'val2');
    await ee.emit('eventStream', 'val3');
    stream.destroy();
  });

  await new Promise((resolve) => stream.on('close', resolve));

  assert.deepStrictEqual(results, ['val1', 'val2', 'val3']);
});

test('Stream.toEventEmitter default event name is data', async () => {
  const stream = new metautil.Stream(null, { objectMode: true });
  const emitter = stream.toEventEmitter();
  const results = [];

  emitter.on('data', (chunk) => results.push(chunk));

  stream.push('default1');
  stream.push('default2');
  stream.push(null);

  await once(emitter, 'end');

  assert.deepStrictEqual(results, ['default1', 'default2']);
});
