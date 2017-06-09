'use strict';

const tap = require('tap');
const common = require('..');

tap.test('zipWith', (test) => {
  const data = [
    [1, 2, 3],
    ['one', 'two', 'three'],
    ['один', 'два', 'три'],
  ];
  const makeDict = (num, eng, rus) => ({ num, eng, rus });
  const expected = [
    { num: 1, eng: 'one', rus: 'один' },
    { num: 2, eng: 'two', rus: 'два' },
    { num: 3, eng: 'three', rus: 'три' },
  ];
  const res = common.zipWith(makeDict, ...data);
  test.strictSame(res, expected);
  test.end();
});
