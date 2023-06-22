'use strict';

const metatests = require('metatests');
const metautil = require('..');

metatests.test('Error', async (test) => {
  const error1 = new metautil.Error('Custom error', 1001);
  test.strictSame(typeof error1.stack, 'string');
  test.strictSame(error1 instanceof Error, true);
  test.strictSame(error1 instanceof metautil.Error, true);
  test.strictSame(error1.message, 'Custom error');
  test.strictSame(error1.code, 1001);
  test.strictSame(error1.cause, undefined);

  const error2 = new metautil.Error('Ups', { code: 1001, cause: error1 });
  test.strictSame(error2.code, 1001);
  test.strictSame(error2.cause, error1);

  const error3 = new metautil.Error('Something went wrong');
  test.strictSame(error3.code, undefined);
  test.strictSame(error3.cause, undefined);

  const error4 = new metautil.Error('Something went wrong', 'ERRCODE');
  test.strictSame(error4.code, 'ERRCODE');

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
