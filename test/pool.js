'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metautil = require('..');

test('Pool: add/next', async () => {
  const pool = new metautil.Pool();

  const obj1 = { a: 1 };
  pool.add(obj1);
  const obj2 = { a: 2 };
  pool.add(obj2);
  const obj3 = { a: 3 };
  pool.add(obj3);

  assert.strictEqual(await pool.next(), obj1);
  assert.strictEqual(await pool.next(), obj2);
  assert.strictEqual(await pool.next(), obj3);
  assert.strictEqual(await pool.next(), obj1);
});

test('Pool: empty', async () => {
  const pool = new metautil.Pool();
  assert.strictEqual(await pool.next(), null);
});

test('Pool: capture/next', async () => {
  const pool = new metautil.Pool();

  const obj1 = { a: 1 };
  pool.add(obj1);
  const obj2 = { a: 2 };
  pool.add(obj2);
  const obj3 = { a: 3 };
  pool.add(obj3);

  assert.strictEqual(pool.isFree(obj1), true);
  assert.strictEqual(pool.isFree(obj2), true);
  assert.strictEqual(pool.isFree(obj3), true);

  const item = await pool.capture();
  assert.strictEqual(item, obj1);
  assert.strictEqual(pool.isFree(item), false);
  assert.strictEqual(await pool.next(), obj2);
  assert.strictEqual(await pool.next(), obj3);
  assert.strictEqual(await pool.next(), obj2);

  pool.release(item);
  assert.strictEqual(pool.isFree(item), true);
  try {
    pool.release(item);
  } catch (err) {
    assert.strictEqual(err.message, 'Pool: release not captured');
  }
  assert.strictEqual(await pool.next(), obj3);
  assert.strictEqual(await pool.next(), obj1);
});

test('Pool: capture/release', async () => {
  const pool = new metautil.Pool();

  const obj1 = { a: 1 };
  pool.add(obj1);
  const obj2 = { a: 2 };
  pool.add(obj2);
  const obj3 = { a: 3 };
  pool.add(obj3);

  const item1 = await pool.capture();
  assert.strictEqual(item1, obj1);
  const item2 = await pool.capture();
  assert.strictEqual(item2, obj2);
  const item3 = await pool.capture();
  assert.strictEqual(item3, obj3);

  pool.release(obj3);
  const item4 = await pool.capture();
  assert.strictEqual(item4, obj3);
});

test('Pool: wait for release', async () => {
  const pool = new metautil.Pool();

  const obj1 = { a: 1 };
  pool.add(obj1);
  const obj2 = { a: 2 };
  pool.add(obj2);

  const item1 = await pool.capture();
  const item2 = await pool.capture();

  pool.capture().then((item3) => {
    assert.strictEqual(item3, obj2);
  });
  pool.capture().then((item4) => {
    assert.strictEqual(item4, obj1);
  });

  pool.release(item2);
  pool.release(item1);
});

test('Pool: wait timeout', async () => {
  const pool = new metautil.Pool();

  const obj1 = { a: 1 };
  pool.add(obj1);
  const obj2 = { a: 2 };
  pool.add(obj2);

  const item1 = await pool.capture();
  assert.strictEqual(item1, obj1);
  const item2 = await pool.capture();
  assert.strictEqual(item2, obj2);

  pool.capture().then((item3) => {
    assert.strictEqual(item3, obj2);
  });
  pool.capture().catch((err) => {
    assert.strictEqual(err.message, 'Pool next item timeout');
  });

  pool.release(obj2);
});

test('Pool: sync capture timeout', () => {
  const pool = new metautil.Pool();

  const obj1 = { a: 1 };
  pool.add(obj1);
  const obj2 = { a: 2 };
  pool.add(obj2);

  const p1 = pool.capture();
  const p2 = pool.capture();
  const p3 = pool.capture();

  p1.then((item1) => {
    assert.strictEqual(item1, obj1);
  });

  p2.then((item2) => {
    assert.strictEqual(item2, obj2);
  });

  p3.catch((err) => {
    assert.strictEqual(err.message, 'Pool next item timeout');
  });
});

test('Pool: prevent infinite loop', async () => {
  const pool = new metautil.Pool();

  const obj1 = { a: 1 };
  pool.add(obj1);
  const obj2 = { a: 2 };
  pool.add(obj2);

  await pool.next();
  const item1 = await pool.capture();
  assert.strictEqual(item1, obj2);
  await pool.next();
  const item2 = await pool.capture();
  assert.strictEqual(item2, obj1);
});

test('Pool: release to queue', async () => {
  const pool = new metautil.Pool();

  const obj = { a: 1 };
  pool.add(obj);

  const item = await pool.capture();
  pool.capture().then((item) => {
    assert(pool.available === 0);
    assert(!pool.isFree(item));
    assert.strictEqual(item, obj);
  });

  pool.release(item);
});
