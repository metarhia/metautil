'use strict';

const metatests = require('metatests');
const metautil = require('..');

metatests.test('Error', async (test) => {
  const e1 = new metautil.Error('Custom error', 1001);
  test.strictSame(typeof e1.stack, 'string');
  test.strictSame(e1 instanceof Error, true);
  test.strictSame(e1 instanceof metautil.Error, true);
  test.strictSame(e1.message, 'Custom error');
  test.strictSame(e1.code, 1001);
  test.strictSame(e1.cause, undefined);

  const e2 = new metautil.Error('Ups', { code: 1001, cause: e1 });
  test.strictSame(e2.code, 1001);
  test.strictSame(e2.cause, e1);

  const e3 = new metautil.Error('Something went wrong');
  test.strictSame(e3.code, undefined);
  test.strictSame(e3.cause, undefined);

  const e4 = new metautil.Error('Something went wrong', 'ERRCODE');
  test.strictSame(e4.code, 'ERRCODE');

  const e5 = new metautil.DomainError('ERRCODE');
  test.strictSame(e5.message, 'Domain error');
  test.strictSame(e5.code, 'ERRCODE');

  const e6 = new metautil.DomainError('ERR', { code: 'CODE' });
  test.strictSame(e6.message, 'Domain error');
  test.strictSame(e6.code, 'ERR');

  const e7 = new metautil.DomainError('ERR', { code: 'CODE', cause: e1 });
  test.strictSame(e7.message, 'Domain error');
  test.strictSame(e7.code, 'ERR');
  test.strictSame(e7.cause, e1);

  const e8 = new metautil.DomainError({ code: 'CODE', cause: e1 });
  test.strictSame(e8.message, 'Domain error');
  test.strictSame(e8.code, 'CODE');
  test.strictSame(e8.cause, e1);

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
