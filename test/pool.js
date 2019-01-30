'use strict';

const metatests = require('metatests');
const { Pool } = require('..');

const BUF_LEN = 1000;

metatests.test(
  'Pool#get() on Pool without factory must return null when empty',
  test => {
    const p = new Pool();
    test.strictSame(p.get(), null);
    test.end();
  }
);

metatests.test(
  'Pool#get() on Pool without factory must return any value put before',
  test => {
    const p = new Pool();
    for (let i = 0; i < 10; i++) {
      p.put(Buffer.allocUnsafe(BUF_LEN));
    }
    const b = p.get();
    test.assert(Buffer.isBuffer(b));
    test.strictSame(b.length, BUF_LEN);
    test.end();
  }
);

metatests.test(
  'Pool#get() on empty Pool with factory must return values retrieved from it',
  test => {
    const p = new Pool(test.mustCall(() => Buffer.allocUnsafe(BUF_LEN), 2));
    const b1 = p.get();
    const b2 = p.get();
    test.assert(Buffer.isBuffer(b1));
    test.assert(Buffer.isBuffer(b2));
    test.strictSame(b1.length, BUF_LEN);
    test.strictSame(b2.length, BUF_LEN);
    test.end();
  }
);
