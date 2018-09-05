'use strict';

const metatests = require('metatests');
const common = require('..');

metatests.test('curry(f)(1)(2)(3)', (test) => {
  const sum = (x, y, z) => (x + y + z);
  const res = common.curry(sum)(1)(2)(3);
  test.strictSame(res, 6);
  test.end();
});

metatests.test('curry(f, 1)(2)(3)', (test) => {
  const sum = (x, y, z) => (x + y + z);
  const res = common.curry(sum, 1)(2)(3);
  test.strictSame(res, 6);
  test.end();
});

metatests.test('curry(f, 1, 2)(3)', (test) => {
  const sum = (x, y, z) => (x + y + z);
  const res = common.curry(sum, 1, 2)(3);
  test.strictSame(res, 6);
  test.end();
});

metatests.test('curry(f, 1, 2, 3)', (test) => {
  const sum = (x, y, z) => (x + y + z);
  const res = common.curry(sum, 1, 2, 3);
  test.strictSame(res, 6);
  test.end();
});

metatests.test('curry(f, 1)(2, 3)', (test) => {
  const sum = (x, y, z) => (x + y + z);
  const res = common.curry(sum, 1)(2, 3);
  test.strictSame(res, 6);
  test.end();
});

metatests.test('curry(f)(1, 2, 3)', (test) => {
  const sum = (x, y, z) => (x + y + z);
  const res = common.curry(sum)(1, 2, 3);
  test.strictSame(res, 6);
  test.end();
});
