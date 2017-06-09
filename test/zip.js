'use strict';

const tap = require('tap');
const common = require('..');

tap.test('zip', (test) => {
  const data = [
    [1, 2, 3],
    ['one', 'two', 'three'],
    ['один', 'два', 'три'],
  ];
  const expected = [
    [1, 'one', 'один'],
    [2, 'two', 'два'],
    [3, 'three', 'три'],
  ];
  const res = common.zip(...data);
  test.strictSame(res, expected);
  test.end();
});

tap.test('zip with no elements', (test) => {
  const res = common.zip();
  test.strictSame(res, []);
  test.end();
});
