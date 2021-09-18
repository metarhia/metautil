'use strict';

const metatests = require('metatests');
const metautil = require('..');

metatests.test('Pool: add/next', (test) => {
  const pool = new metautil.Pool();
  const obj1 = {};
  const obj2 = {};
  const obj3 = {};
  pool.add(obj1);
  pool.add(obj2);
  pool.add(obj3);
  test.strictSame(pool.next(), obj1);
  test.strictSame(pool.next(), obj2);
  test.strictSame(pool.next(), obj3);
  test.strictSame(pool.next(), obj1);
  test.end();
});

metatests.test('Pool: empty', (test) => {
  const pool = new metautil.Pool();
  test.strictSame(pool.next(), null);
  test.end();
});

metatests.test('Pool: capture/release', (test) => {
  const pool = new metautil.Pool();
  const obj1 = {};
  const obj2 = {};
  const obj3 = {};
  pool.add(obj1);
  pool.add(obj2);
  pool.add(obj3);
  const item = pool.capture();
  test.strictSame(item, obj1);
  test.strictSame(pool.next(), obj2);
  test.strictSame(pool.next(), obj3);
  test.strictSame(pool.next(), obj2);
  pool.release(item);
  test.strictSame(pool.next(), obj3);
  test.strictSame(pool.next(), obj1);
  test.end();
});
