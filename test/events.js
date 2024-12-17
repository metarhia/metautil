'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');

test('EventEmitter', async () => {
  const ee = new metautil.EventEmitter();

  assert.strictEqual(ee.getMaxListeners(), 10);
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
  ee.remove('name1', fn);
  assert.strictEqual(ee.listenerCount('name1'), 1);

  ee.emit('name1', 'value');
  assert.strictEqual(count, 1);

  ee.clear('name1');
  assert.strictEqual(ee.listenerCount('name1'), 0);

  setTimeout(() => {
    ee.emit('name3', 'value');
  }, 50);

  const result = await metautil.once(ee, 'name3');
  assert.strictEqual(result, 'value');

  ee.clear();
  assert.strictEqual(ee.listenerCount('name3'), 0);
});
