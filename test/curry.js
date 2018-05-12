'use strict';

api.metatests.test('curry(f)(1)(2)(3)', (test) => {
  const sum = (x, y, z) => (x + y + z);
  const res = api.common.curry(sum, 1)(2)(3);
  test.strictSame(res, 6);
  test.end();
});

api.metatests.test('curry(f, 1)(2)(3)', (test) => {
  const sum = (x, y, z) => (x + y + z);
  const res = api.common.curry(sum, 1)(2)(3);
  test.strictSame(res, 6);
  test.end();
});

api.metatests.test('curry(f, 1, 2)(3)', (test) => {
  const sum = (x, y, z) => (x + y + z);
  const res = api.common.curry(sum, 1, 2)(3);
  test.strictSame(res, 6);
  test.end();
});

api.metatests.test('curry(f, 1, 2, 3)', (test) => {
  const sum = (x, y, z) => (x + y + z);
  const res = api.common.curry(sum, 1, 2, 3);
  test.strictSame(res, 6);
  test.end();
});

api.metatests.test('curry(f, 1)(2, 3)', (test) => {
  const sum = (x, y, z) => (x + y + z);
  const res = api.common.curry(sum, 1)(2, 3);
  test.strictSame(res, 6);
  test.end();
});

api.metatests.test('curry(f)(1, 2, 3)', (test) => {
  const sum = (x, y, z) => (x + y + z);
  const res = api.common.curry(sum)(1, 2, 3);
  test.strictSame(res, 6);
  test.end();
});
