'use strict';

const metatests = require('metatests');
const common = require('..');

metatests.test('safe require success', test => {
  const safeRequire = common.safe(require);
  const result = safeRequire('./mp');
  test.strictSame(!!result[0], false);
  test.strictSame(!!result[1], true);
  test.end();
});

metatests.test('safe require fail', test => {
  const safeRequire = common.safe(require);
  const result = safeRequire('./name');
  test.strictSame(!!result[0], true);
  test.strictSame(!!result[1], false);
  test.end();
});

metatests.test('safe parser success', test => {
  const parser = common.safe(JSON.parse);
  const result = parser('{"a":5}');
  test.strictSame(!!result[0], false);
  test.strictSame(!!result[1], true);
  test.end();
});

metatests.test('safe parser fail', test => {
  const parser = common.safe(JSON.parse);
  const result = parser('{a:}');
  test.strictSame(!!result[0], true);
  test.strictSame(!!result[1], false);
  test.end();
});
