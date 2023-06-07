'use strict';

const metatests = require('metatests');
const metautil = require('..');

metatests.test('Error', async (test) => {
  const error = new metautil.Error('Custom error', 1001);
  test.strictSame(typeof error.stack, 'string');
  test.strictSame(error instanceof Error, true);
  test.strictSame(error instanceof metautil.Error, true);
  test.strictSame(error.message, 'Custom error');
  test.strictSame(error.code, 1001);
  test.end();
});

class ExampleError {}

class ExtendedError extends Error {}

metatests.case(
  'Error utilities',
  { metautil },
  {
    'metautil.isError': [
      [new Error('Simple'), true],
      [new SyntaxError('Bug is here'), true],
      [new ExampleError('Example'), true],
      [new ExtendedError('Extended'), true],
      [{}, false],
      [[], false],
      [null, false],
      [undefined, false],
    ],
  },
);
