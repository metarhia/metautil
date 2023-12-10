'use strict';

const metatests = require('metatests');
const metautil = require('..');

metatests.test('EventEmitter', async (test) => {
  const ee = new metautil.EventEmitter();

  test.strictSame(ee.getMaxListeners(), 10);
  test.assert(ee.events instanceof Map);

  let onCount = 0;
  let onceCount = 0;

  ee.on('name1', (data) => {
    test.strictSame(data, 'value');
    onCount++;
  });

  ee.once('name1', (data) => {
    test.strictSame(data, 'value');
    onceCount++;
  });

  ee.emit('name1', 'value');
  ee.emit('name1', 'value');

  test.strictSame(onCount, 2);
  test.strictSame(onceCount, 1);

  test.strictSame(ee.listenerCount('name1'), 1);
  test.strictSame(ee.listenerCount('name2'), 0);

  let count = 0;
  const fn = () => {
    count++;
  };
  ee.on('name1', fn);
  ee.emit('name1', 'value');
  test.strictSame(count, 1);

  test.strictSame(ee.listenerCount('name1'), 2);
  ee.remove('name1', fn);
  test.strictSame(ee.listenerCount('name1'), 1);

  ee.emit('name1', 'value');
  test.strictSame(count, 1);

  ee.clear('name1');
  test.strictSame(ee.listenerCount('name1'), 0);

  setTimeout(() => {
    ee.emit('name3', 'value');
  }, 50);

  const result = await metautil.once(ee, 'name3');
  test.strictSame(result, 'value');

  ee.clear();
  test.strictSame(ee.listenerCount('name3'), 0);

  test.end();
});
