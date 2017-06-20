'use strict';

const tap = require('tap');
const common = require('..');

tap.test('requireEither', (test) => {
  const lib = common.requireEither('..', 'non-existing-library');
  test.strictSame(lib, common);
  test.end();
});

tap.test('requireEither first failes', (test) => {
  const lib = common.requireEither('non-existing-library', '..');
  test.strictSame(lib, common);
  test.end();
});

tap.test('requireEither both fail', (test) => {
  const errMsg = 'Cannot find module \'non-existing-library-2\'';
  const expectedErr = new Error(errMsg);
  test.throws(() => (
    common.requireEither('non-existing-library', 'non-existing-library-2')
  ), expectedErr);
  test.end();
});
