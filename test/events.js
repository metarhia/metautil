'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');

test('EventEmitter', async () => {
  const ee = new metautil.EventEmitter();

  assert.strictEqual(ee.maxListeners, 10);
  assert(ee.events instanceof Map);

  let onCount = 0;
  let onceCount = 0;

  ee.on('name1', (data) => {
    assert.strictEqual(data, 'value');
    onCount++;
  });

  ee.once('name1', (data) => {
    assert.strictEqual(data, 'value');
    onceCount++;
  });

  ee.emit('name1', 'value');
  ee.emit('name1', 'value');

  assert.strictEqual(onCount, 2);
  assert.strictEqual(onceCount, 1);

  assert.strictEqual(ee.listenerCount('name1'), 1);
  assert.strictEqual(ee.listenerCount('name2'), 0);

  let count = 0;
  const fn = () => {
    count++;
  };
  ee.on('name1', fn);
  ee.emit('name1', 'value');
  assert.strictEqual(count, 1);

  assert.strictEqual(ee.listenerCount('name1'), 2);
  ee.off('name1', fn);
  assert.strictEqual(ee.listenerCount('name1'), 1);

  ee.emit('name1', 'value');
  assert.strictEqual(count, 1);

  ee.clear('name1');
  assert.strictEqual(ee.listenerCount('name1'), 0);

  setTimeout(() => {
    ee.emit('name3', 'value');
  }, 50);

  const result = await ee.toPromise('name3');
  assert.strictEqual(result, 'value');

  ee.clear();
  assert.strictEqual(ee.listenerCount('name3'), 0);

  const emitExpect = ['await emit 1', 'await emit 2', 'await emit 3'];
  emitExpect.forEach((e) => ee.on('name5', () => e));
  const emitResult = await ee.emit('name5');
  assert.deepStrictEqual(emitResult, emitExpect);
});

test('Emitter.toAsyncIterable', async (testCase) => {
  await testCase.test('base', async () => {
    const ee = new metautil.EventEmitter();
    process.nextTick(async () => {
      await ee.emit('name4', 'foo');
      await ee.emit('name4', 'banana');
      await ee.emit('name4', 'nana');
    });
    setTimeout(() => ee.emit('name4', 0), 0);
    setTimeout(() => ee.emit('name4', 1), 0);
    setTimeout(() => ee.emit('name4', 2), 0);
    setTimeout(() => ee.emit('name4', 'stop'), 0);
    const iteratorExpect = ['foo', 'banana', 'nana', 0, 1, 2, 'stop'];
    for await (const event of ee.toAsyncIterable('name4')) {
      const current = iteratorExpect.shift();
      assert.deepStrictEqual(current, event);
      if (!iteratorExpect.length) {
        break;
      }
    }
    assert.strictEqual(ee.listenerCount('name4'), 0);
    assert.strictEqual(ee.listenerCount('error'), 0);
  });
  await testCase.test('error', async () => {
    const ee = new metautil.EventEmitter();
    const expectedError = new Error('Big bang');
    process.nextTick(() => {
      ee.emit('error', expectedError);
      ee.emit('bang', 'bang event');
    });
    let loopedEvent = null;
    let thrown = false;
    try {
      for await (const event of ee.toAsyncIterable('bang')) {
        loopedEvent = event;
      }
    } catch (err) {
      thrown = true;
      assert.strictEqual(err, expectedError);
    }
    assert.strictEqual(thrown, true);
    assert.strictEqual(loopedEvent, null);
  });
  await testCase.test('errorDelayed', async () => {
    const ee = new metautil.EventEmitter();
    const _err = new Error('kaboom');
    process.nextTick(async () => {
      await ee.emit('foo', 42);
      await ee.emit('error', _err);
    });
    const expected = 42;
    let thrown = false;

    try {
      for await (const event of ee.toAsyncIterable('foo')) {
        assert.deepStrictEqual(expected, event);
      }
    } catch (err) {
      thrown = true;
      assert.strictEqual(err, _err);
    }
    assert.strictEqual(thrown, true);
    assert.strictEqual(ee.listenerCount('foo'), 0);
    assert.strictEqual(ee.listenerCount('error'), 0);
  });

  await testCase.test('throwInLoop', async () => {
    const ee = new metautil.EventEmitter();
    const _err = new Error('kaboom');

    process.nextTick(() => {
      ee.emit('foo', 42);
    });

    try {
      for await (const event of ee.toAsyncIterable('foo')) {
        assert.deepStrictEqual(event, 42);
        throw _err;
      }
    } catch (err) {
      assert.strictEqual(err, _err);
    }

    assert.strictEqual(ee.listenerCount('foo'), 0);
    assert.strictEqual(ee.listenerCount('error'), 0);
  });

  await testCase.test('next', async () => {
    const ee = new metautil.EventEmitter();
    const iterable = ee.toAsyncIterable('foo');
    const iterator = iterable[Symbol.asyncIterator]();

    process.nextTick(async () => {
      await ee.emit('foo', 'bar');
      await ee.emit('foo', 42);
      iterator.return();
    });

    const first = await iterator.next();
    const second = await iterator.next();
    const third = await iterator.next();
    const results = [first, second, third];

    assert.deepStrictEqual(results, [
      {
        value: 'bar',
        done: false,
      },
      {
        value: 42,
        done: false,
      },
      {
        value: undefined,
        done: true,
      },
    ]);
    assert.deepStrictEqual(await iterator.next(), {
      value: undefined,
      done: true,
    });
  });
});
