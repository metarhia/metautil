'use strict';

const tap = require('tap');
const common = require('..');

tap.test('curry(f)(1)(2)(3)', (test) => {
  const sum = (x, y, z) => (x + y + z);
  const res = common.curry(sum, 1)(2)(3);
  test.strictSame(res, 6);
  test.end();
});

tap.test('curry(f, 1)(2)(3)', (test) => {
  const sum = (x, y, z) => (x + y + z);
  const res = common.curry(sum, 1)(2)(3);
  test.strictSame(res, 6);
  test.end();
});

tap.test('curry(f, 1, 2)(3)', (test) => {
  const sum = (x, y, z) => (x + y + z);
  const res = common.curry(sum, 1, 2)(3);
  test.strictSame(res, 6);
  test.end();
});

tap.test('curry(f, 1, 2, 3)', (test) => {
  const sum = (x, y, z) => (x + y + z);
  const res = common.curry(sum, 1, 2, 3);
  test.strictSame(res, 6);
  test.end();
});

tap.test('curry(f, 1)(2, 3)', (test) => {
  const sum = (x, y, z) => (x + y + z);
  const res = common.curry(sum, 1)(2, 3);
  test.strictSame(res, 6);
  test.end();
});

tap.test('curry(f)(1, 2, 3)', (test) => {
  const sum = (x, y, z) => (x + y + z);
  const res = common.curry(sum)(1, 2, 3);
  test.strictSame(res, 6);
  test.end();
});
