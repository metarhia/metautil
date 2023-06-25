'use strict';

const metatests = require('metatests');
const metautil = require('..');

metatests.test('Error', async (test) => {
  const errors = {
    ENOUSER: 'User not found',
    ENEGPRICE: 'Negative price',
    EMANYREQ: 'Too many attempts',
  };

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

  const de1 = new metautil.DomainError('ENOUSER');
  test.strictSame(de1.message, 'Domain error');
  test.strictSame(de1.code, 'ENOUSER');

  const e5 = de1.toError(errors);
  test.strictSame(e5.message, 'User not found');
  test.strictSame(e5.code, 'ENOUSER');

  const de2 = new metautil.DomainError('ERR', { code: 'CODE' });
  test.strictSame(de2.message, 'Domain error');
  test.strictSame(de2.code, 'ERR');

  const e6 = de2.toError(errors);
  test.strictSame(e6.message, 'Domain error');
  test.strictSame(e6.code, 'ERR');

  const de3 = new metautil.DomainError('ERR', { code: 'CODE', cause: e1 });
  test.strictSame(de3.message, 'Domain error');
  test.strictSame(de3.code, 'ERR');
  test.strictSame(de3.cause, e1);

  const de4 = new metautil.DomainError({ code: 'CODE', cause: e1 });
  test.strictSame(de4.message, 'Domain error');
  test.strictSame(de4.code, 'CODE');
  test.strictSame(de4.cause, e1);

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
