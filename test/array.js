'use strict';

const tap = require('tap');
const common = require('..');

tap.test('splitAt', (test) => {
  const array = [1, 2, 3, 4, 5];
  const result = common.splitAt(3, array);
  test.strictSame(result, [[1, 2, 3], [4, 5]]);
  test.end();
});

tap.test('last', (test) => {
  const array = [1, 2, 3, 4, 5];
  const result = common.last(array);
  test.strictSame(result, 5);
  test.end();
});

tap.test('last single', (test) => {
  const array = [5];
  const result = common.last(array);
  test.strictSame(result, 5);
  test.end();
});

tap.test('last empty', (test) => {
  const array = [];
  const result = common.last(array);
  test.strictSame(result, undefined);
  test.end();
});

tap.test('range', (test) => {
  const rangeArray = common.range(1, 5);
  test.strictSame(rangeArray, [1, 2, 3, 4, 5]);
  test.end();
});

tap.test('sequence full', (test) => {
  const sequence = common.sequence([80, 81, 82]);
  test.strictSame(sequence, [80, 81, 82]);
  test.end();
});

tap.test('sequence from..to', (test) => {
  // eslint-disable-next-line no-sparse-arrays
  const sequence = common.sequence([40,, 45]);
  test.strictSame(sequence, [40, 41, 42, 43, 44, 45]);
  test.end();
});

tap.test('sequence from..count', (test) => {
  const sequence = common.sequence([40, [6]]);
  test.strictSame(sequence, [40, 41, 42, 43, 44, 45]);
  test.end();
});

tap.test('sequence from..max-to', (test) => {
  const sequence = common.sequence([40, [-3]], 6);
  test.strictSame(sequence, [40, 41, 42]);
  test.end();
});
