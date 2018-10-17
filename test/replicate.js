'use strict';

const metatests = require('metatests');
const common = require('..');

metatests.test('replicate', test => {
  const expected = [true, true, true, true, true];
  const result = common.replicate(5, true);
  test.strictSame(result, expected);
  test.end();
});
