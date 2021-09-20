'use strict';

const metatests = require('metatests');
const metautil = require('..');

metatests.test('Pool: add/next', async (test) => {
  const pool = new metautil.Pool();
  const obj1 = {};
  const obj2 = {};
  const obj3 = {};
  pool.add(obj1);
  pool.add(obj2);
  pool.add(obj3);
  test.strictSame(await pool.next(), obj1);
  test.strictSame(await pool.next(), obj2);
  test.strictSame(await pool.next(), obj3);
  test.strictSame(await pool.next(), obj1);
  test.end();
});

metatests.test('Pool: empty', async (test) => {
  const pool = new metautil.Pool();
  test.strictSame(await pool.next(), null);
  test.end();
});

metatests.test('Pool: capture/release', async (test) => {
  const pool = new metautil.Pool();
  const obj1 = {};
  const obj2 = {};
  const obj3 = {};
  pool.add(obj1);
  pool.add(obj2);
  pool.add(obj3);
  const item = await pool.capture();
  test.strictSame(item, obj1);
  test.strictSame(await pool.next(), obj2);
  test.strictSame(await pool.next(), obj3);
  test.strictSame(await pool.next(), obj2);
  pool.release(item);
  test.strictSame(await pool.next(), obj3);
  test.strictSame(await pool.next(), obj1);
  test.end();
});

metatests.test('Pool: wait for release', async (test) => {
  const pool = new metautil.Pool();
  const obj1 = {};
  const obj2 = {};
  pool.add(obj1);
  pool.add(obj2);
  const item1 = await pool.capture();
  const item2 = await pool.capture();
  pool.capture().then((item3) => {
    test.strictSame(item3, obj2);
  });
  pool.capture().then((item4) => {
    test.strictSame(item4, obj1);
  });
  pool.release(item2);
  pool.release(item1);
  test.end();
});

metatests.test('Pool: wait timeout', async (test) => {
  const pool = new metautil.Pool();
  const obj1 = {};
  const obj2 = {};
  pool.add(obj1);
  pool.add(obj2);
  const item1 = await pool.capture();
  const item2 = await pool.capture();
  test.strictSame(item1, obj1);
  pool.capture().then((item3) => {
    test.strictSame(item3, obj2);
  });
  pool.capture().catch((err) => {
    test.strictSame(err.message, 'Error: Pool next item timeout');
  });
  pool.release(item2);
  test.end();
});
