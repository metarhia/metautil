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

test('EventIterator', async (testCase) => {
  await testCase.test('base', async () => {
    const ee = new metautil.EventEmitter();
    const iterator = ee.toIterator('name4');
    process.nextTick(async () => {
      await ee.emit('name4', 'foo', 'bar', 12);
      await ee.emit('name4', 'banana');
      await ee.emit('name4', 'nana');
    });
    setTimeout(() => ee.emit('name4', 0), 0);
    setTimeout(() => ee.emit('name4', 1, 11, 'test'), 0);
    setTimeout(() => ee.emit('name4', 2), 0);
    setTimeout(() => ee.emit('name4', 'stop'), 0);
    const iteratorExpect = [
      ['foo', 'bar', 12],
      ['banana'],
      ['nana'],
      [0],
      [1, 11, 'test'],
      [2],
      ['stop'],
    ];
    for await (const event of iterator) {
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
    const iteratorWithError = ee.toIterator('bang');
    const expectedError = new Error('Big bang');
    process.nextTick(() => {
      ee.emit('error', expectedError);
    });
    let looped = false;
    let thrown = false;
    try {
      // eslint-disable-next-line no-unused-vars
      for await (const event of iteratorWithError) {
        looped = true;
      }
    } catch (err) {
      thrown = true;
      assert.strictEqual(err, expectedError);
    }
    assert.strictEqual(thrown, true);
    assert.strictEqual(looped, false);
  });
  await testCase.test('errorDelayed', async () => {
    const ee = new metautil.EventEmitter();
    const _err = new Error('kaboom');
    process.nextTick(async () => {
      await ee.emit('foo', 42);
      await ee.emit('error', _err);
    });

    const iterable = ee.toIterator('foo');
    const expected = [[42]];
    let thrown = false;

    try {
      for await (const event of iterable) {
        const current = expected.shift();
        assert.deepStrictEqual(current, event);
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
      for await (const event of ee.toIterator('foo')) {
        assert.deepStrictEqual(event, [42]);
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
    const iterable = ee.toIterator('foo');

    process.nextTick(async () => {
      await ee.emit('foo', 'bar');
      await ee.emit('foo', 42);
      iterable.return();
    });

    const first = await iterable.next();
    const second = await iterable.next();
    const third = await iterable.next();
    const results = [first, second, third];

    assert.deepStrictEqual(results, [
      {
        value: ['bar'],
        done: false,
      },
      {
        value: [42],
        done: false,
      },
      {
        value: undefined,
        done: true,
      },
    ]);
    assert.deepStrictEqual(await iterable.next(), {
      value: undefined,
      done: true,
    });
  });
});
