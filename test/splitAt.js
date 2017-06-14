'use strict';

const tap = require('tap');
const common = require('..');

tap.test('splitAt', (test) => {
  const array = [1, 2, 3, 4, 5];
  const result = common.splitAt(3, array);
  test.strictSame(result, [[1, 2, 3], [4, 5]]);
  test.end();
});
