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

  const iterator = ee.toIterator('name4');
  ee.emit('name4', 'start');
  ee.emit('name4', 12, 35);
  ee.emit('name4');
  process.nextTick(() => {
    ee.emit('name4', 'foo', 'bar', 12);
  });
  setTimeout(() => ee.emit('name4', 0), 10);
  setTimeout(() => ee.emit('name4', 1, 11, 'test'), 20);
  setTimeout(() => ee.emit('name4', 2), 30);
  setTimeout(() => ee.emit('name4', 'stop'), 40);
  const iteratorExpect = [
    ['start'],
    [12, 35],
    [],
    ['foo', 'bar', 12],
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

  const iteratorWithError = ee.toIterator('bang');
  const _err = new Error('Big bang');
  process.nextTick(() => {
    ee.emit('error', _err);
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
    assert.strictEqual(err, _err);
  }
  assert.strictEqual(thrown, true);
  assert.strictEqual(looped, false);
  assert.strictEqual(ee.listeners('error').length, 0);

  const emitExpect = ['await emit 1', 'await emit 2', 'await emit 3'];
  emitExpect.forEach((e) => ee.on('name5', () => e));
  const emitResult = await ee.emit('name5');
  assert.deepStrictEqual(emitResult, emitExpect);
});
