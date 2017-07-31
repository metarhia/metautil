'use strict';

const tap = require('tap');
const common = require('..');

tap.test('cache create add get', (test) => {
  const cache = common.cache();

  cache.add('key1', 'value1');
  cache.add('key2', 'value2');
  cache.add('key2', 'value3');

  test.strictSame(cache.get('key1'), 'value1');
  test.strictSame(cache.get('key2'), 'value3');
  test.end();
});

tap.test('cache del key', (test) => {
  const cache = common.cache();

  cache.add('key1', 'value1');
  cache.add('key2', 'value2');
  cache.del('key1');

  test.strictSame(cache.get('key1'), undefined);
  test.strictSame(cache.get('key2'), 'value2');
  test.end();
});

tap.test('cache clr', (test) => {
  const cache = common.cache({ });

  cache.add('key1', 'value1');
  cache.add('str1', 'value2');
  cache.clr('st');

  test.strictSame(cache.get('key1'), 'value1');
  test.strictSame(cache.get('str1'), undefined);
  test.end();
});

tap.test('cache calcSize', (test) => {
  const cache = common.cache({ calcSize: true });

  cache.add('key1', { length: 10, str: '0123456789' });
  cache.add('key2', { length: 20, str: '01234567890123456789' });
  cache.add('key2', { length: 30, str: '012345678901234567890123456789' });

  test.strictSame(cache.get('key2').str, '012345678901234567890123456789');
  test.strictSame(cache.allocated, 40);
  test.end();
});
