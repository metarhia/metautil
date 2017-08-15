'use strict';

const tap = require('tap');
const common = require('..');

tap.test('safe require success', (test) => {
  const safeRequire = common.safe(require);
  const result = safeRequire('./mp');
  test.strictSame(!!result[0], false);
  test.strictSame(!!result[1], true);
  test.end();
});

tap.test('safe require fail', (test) => {
  const safeRequire = common.safe(require);
  const result = safeRequire('./name');
  test.strictSame(!!result[0], true);
  test.strictSame(!!result[1], false);
  test.end();
});

tap.test('safe parser success', (test) => {
  const parser = common.safe(JSON.parse);
  const result = parser('{"a":5}');
  test.strictSame(!!result[0], false);
  test.strictSame(!!result[1], true);
  test.end();
});

tap.test('safe parser fail', (test) => {
  const parser = common.safe(JSON.parse);
  const result = parser('{a:}');
  test.strictSame(!!result[0], true);
  test.strictSame(!!result[1], false);
  test.end();
});
