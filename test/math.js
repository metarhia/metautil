'use strict';

const tap = require('tap');
const common = require('..');

tap.test('random', (test) => {
  const min = 10;
  const max = 20;
  const num = common.random(min, max);
  test.assert(num >= min);
  test.assert(num <= max);
  test.end();
});

tap.test('random max only', (test) => {
  const max = 20;
  const num = common.random(max);
  test.assert(num >= 0);
  test.assert(num <= max);
  test.end();
});
