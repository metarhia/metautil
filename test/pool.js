'use strict';

const metatests = require('metatests');
const metautil = require('..');

metatests.test('Pool: add/next', async (test) => {
  const pool = new metautil.Pool();

  const obj1 = { a: 1 };
  pool.add(obj1);
  const obj2 = { a: 2 };
  pool.add(obj2);
  const obj3 = { a: 3 };
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

metatests.test('Pool: capture/next', async (test) => {
  const pool = new metautil.Pool();

  const obj1 = { a: 1 };
  pool.add(obj1);
  const obj2 = { a: 2 };
  pool.add(obj2);
  const obj3 = { a: 3 };
  pool.add(obj3);

  test.strictSame(pool.isFree(obj1), true);
  test.strictSame(pool.isFree(obj2), true);
  test.strictSame(pool.isFree(obj3), true);

  const item = await pool.capture();
  test.strictSame(item, obj1);
  test.strictSame(pool.isFree(item), false);
  test.strictSame(await pool.next(), obj2);
  test.strictSame(await pool.next(), obj3);
  test.strictSame(await pool.next(), obj2);

  pool.release(item);
  test.strictSame(pool.isFree(item), true);
  try {
    pool.release(item);
  } catch (err) {
    test.strictSame(err.message, 'Pool: release not captured');
  }
  test.strictSame(await pool.next(), obj3);
  test.strictSame(await pool.next(), obj1);
  test.end();
});

metatests.test('Pool: capture/release', async (test) => {
  const pool = new metautil.Pool();

  const obj1 = { a: 1 };
  pool.add(obj1);
  const obj2 = { a: 2 };
  pool.add(obj2);
  const obj3 = { a: 3 };
  pool.add(obj3);

  const item1 = await pool.capture();
  test.strictSame(item1, obj1);
  const item2 = await pool.capture();
  test.strictSame(item2, obj2);
  const item3 = await pool.capture();
  test.strictSame(item3, obj3);

  pool.release(obj3);
  const item4 = await pool.capture();
  test.strictSame(item4, obj3);
  test.end();
});

metatests.test('Pool: wait for release', async (test) => {
  const pool = new metautil.Pool();

  const obj1 = { a: 1 };
  pool.add(obj1);
  const obj2 = { a: 2 };
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

  const obj1 = { a: 1 };
  pool.add(obj1);
  const obj2 = { a: 2 };
  pool.add(obj2);

  const item1 = await pool.capture();
  test.strictSame(item1, obj1);
  const item2 = await pool.capture();
  test.strictSame(item2, obj2);

  pool.capture().then((item3) => {
    test.strictSame(item3, obj2);
  });
  pool.capture().catch((err) => {
    test.strictSame(err.message, 'Error: Pool next item timeout');
  });

  pool.release(obj2);
  test.end();
});

metatests.test('Pool: prevent infinite loop', async (test) => {
  const pool = new metautil.Pool();

  const obj1 = { a: 1 };
  pool.add(obj1);
  const obj2 = { a: 2 };
  pool.add(obj2);

  await pool.next();
  const item1 = await pool.capture();
  test.strictSame(item1, obj2);
  await pool.next();
  const item2 = await pool.capture();
  test.strictSame(item2, obj1);

  test.end();
});
