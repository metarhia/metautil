'use strict';

const tap = require('tap');
const common = require('..');

tap.test('omap', (test) => {
  const persons = {
    vlad: { age: 20, side: 'good' },
    dziuba: { age: 20, side: 'evil' }
  };
  const expected = { vlad: 'good', dziuba: 'evil' };
  const result = common.omap(p => p.side, persons);
  test.strictSame(result, expected);
  test.end();
});
