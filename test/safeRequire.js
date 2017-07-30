'use strict';

const tap = require('tap');
const common = require('..');

tap.test('safeRequire success', (test) => {
  const lib = common.safeRequire('..');
  test.strictSame(lib[0], null);
  test.strictSame(lib[1], common);
  test.end();
});

tap.test('safeRequire fail', (test) => {
  const lib = common.safeRequire('non-existing-library');
  test.strictSame(lib[0] instanceof Error, true);
  test.strictSame(lib[1], null);
  test.end();
});
