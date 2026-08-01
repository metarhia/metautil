'use strict';

const test = require('node:test');
const assert = require('node:assert');

const metatests = require('metatests');
const metautil = require('..');

test('Error', async () => {
  const errors = {
    ENOUSER: 'User not found',
    ENEGPRICE: 'Negative price',
    EMANYREQ: 'Too many attempts',
  };

  const e1 = new metautil.Error('Custom error', 1001);
  assert.strictEqual(typeof e1.stack, 'string');
  assert(e1 instanceof Error);
  assert(e1 instanceof metautil.Error);
  assert.strictEqual(e1.message, 'Custom error');
  assert.strictEqual(e1.name, 'Error');
  assert.strictEqual(e1.code, 1001);
  assert.strictEqual(e1.cause, undefined);

  const e2 = new metautil.Error('Ups', { code: 1001, cause: e1 });
  assert.strictEqual(e2.code, 1001);
  assert.strictEqual(e2.cause, e1);

  const e3 = new metautil.Error('Something went wrong');
  assert.strictEqual(e3.code, undefined);
  assert.strictEqual(e3.cause, undefined);

  const e4 = new metautil.Error('Something went wrong', 'ERRCODE');
  assert.strictEqual(e4.code, 'ERRCODE');

  const eName = new metautil.Error('Timeout aborted', { name: 'AbortError' });
  assert.strictEqual(eName.message, 'Timeout aborted');
  assert.strictEqual(eName.name, 'AbortError');
  assert.strictEqual(eName.code, undefined);

  const eNameCode = new metautil.Error('Stopped', {
    name: 'AbortError',
    code: 'ABORT',
    cause: e1,
  });
  assert.strictEqual(eNameCode.name, 'AbortError');
  assert.strictEqual(eNameCode.code, 'ABORT');
  assert.strictEqual(eNameCode.cause, e1);

  const de1 = new metautil.DomainError('ENOUSER');
  assert.strictEqual(de1.message, 'Domain error');
  assert.strictEqual(de1.name, 'DomainError');
  assert.strictEqual(de1.code, 'ENOUSER');

  const deName = new metautil.DomainError('ENOUSER', { name: 'UserError' });
  assert.strictEqual(deName.name, 'UserError');
  assert.strictEqual(deName.code, 'ENOUSER');

  const eNull = new metautil.Error('Null options', null);
  assert.strictEqual(eNull.message, 'Null options');
  assert.strictEqual(eNull.name, 'Error');
  assert.strictEqual(eNull.code, null);

  const e5 = de1.toError(errors);
  assert.strictEqual(e5.message, 'User not found');
  assert.strictEqual(e5.code, 'ENOUSER');

  const de2 = new metautil.DomainError('ERR', { code: 'CODE' });
  assert.strictEqual(de2.message, 'Domain error');
  assert.strictEqual(de2.code, 'ERR');

  const e6 = de2.toError(errors);
  assert.strictEqual(e6.message, 'Domain error');
  assert.strictEqual(e6.code, 'ERR');

  const de3 = new metautil.DomainError('ERR', { code: 'CODE', cause: e1 });
  assert.strictEqual(de3.message, 'Domain error');
  assert.strictEqual(de3.code, 'ERR');
  assert.strictEqual(de3.cause, e1);

  const de4 = new metautil.DomainError({ code: 'CODE', cause: e1 });
  assert.strictEqual(de4.message, 'Domain error');
  assert.strictEqual(de4.code, 'CODE');
  assert.strictEqual(de4.cause, e1);
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
