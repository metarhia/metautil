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
  const iteratorResults = [];
  ee.emit('name4', 'start');
  ee.emit('name4', 12, 35);
  setTimeout(() => ee.emit('name4', 0), 10);
  setTimeout(() => ee.emit('name4', 1, 11, 'test'), 20);
  setTimeout(() => ee.emit('name4', 2), 30);
  setTimeout(() => ee.emit('name4', 'stop'), 40);
  for await (const data of iterator) {
    iteratorResults.push(data);
    if (data[0] === 'stop') {
      iterator.return();
      break;
    }
  }
  assert.deepStrictEqual(iteratorResults, [
    ['start'],
    [12, 35],
    [0],
    [1, 11, 'test'],
    [2],
    ['stop'],
  ]);

  const emitExpect = ['await emit 5', 'await emit 6', 'await emit 7'];
  emitExpect.forEach((e) => ee.on('name5', () => e));
  const emitResult = await ee.emit('name5');
  assert.deepStrictEqual(emitResult, emitExpect);
});
