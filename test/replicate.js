'use strict';

const tap = require('tap');
const common = require('..');

tap.test('replicate', (test) => {
  const expected = [true, true, true, true, true];
  const result = common.replicate(5, true);
  test.strictSame(result, expected);
  test.end();
});
