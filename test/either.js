'use strict';

const tap = require('tap');
const common = require('..');

tap.test('either', (test) => {
  const fnEither = common.either(x => x * 2);

  const res = fnEither(1, 2);

  test.strictSame(res, 2);
  test.end();
});

tap.test('either with one error and one success', (test) => {
  const fnError = new Error('either with error');
  const fn = (x) => {
    if (x === 1) {
      throw fnError;
    } else {
      return x * 2;
    }
  };
  const fnEither = common.either(fn);

  const res = fnEither(1, 2);

  test.strictSame(res, 4);
  test.end();
});

tap.test('either with all errors', (test) => {
  const fnError1 = new Error('either with error 1');
  const fnError2 = new Error('either with error 2');
  const fn = (x) => {
    if (x === 1) {
      throw fnError1;
    } else {
      throw fnError2;
    }
  };
  const fnEither = common.either(fn);

  test.throws(fnEither.bind(null, 1, 2), fnError2);
  test.end();
});
