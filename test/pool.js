'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const metautil = require('..');

test('Pool: add + next', () => {
  const pool = new metautil.Pool();

  const obj1 = { a: 1 };
  pool.add(obj1);
  const obj2 = { a: 2 };
  pool.add(obj2);
  const obj3 = { a: 3 };
  pool.add(obj3);

  assert.strictEqual(pool.next(), obj1);
  assert.strictEqual(pool.next(), obj2);
  assert.strictEqual(pool.next(), obj3);
  assert.strictEqual(pool.next(), obj1);
});

test('Pool: empty', () => {
  const pool = new metautil.Pool();
  assert.strictEqual(pool.next(), null);
});

test('Pool: capture + release', async () => {
  const pool = new metautil.Pool();

  const obj1 = { a: 1 };
  pool.add(obj1);
  const obj2 = { a: 2 };
  pool.add(obj2);

  assert.strictEqual(pool.isFree(obj1), true);
  assert.strictEqual(pool.isFree(obj2), true);

  const lease = await pool.capture();
  assert.strictEqual(lease.resource, obj1);
  assert.strictEqual(pool.isFree(obj1), false);
  assert.strictEqual(pool.next(), obj2);

  pool.release(lease);
  assert.strictEqual(pool.isFree(obj1), true);

  const lease2 = await pool.capture();
  assert.strictEqual(lease2.resource, obj1);
  lease2.release();
  assert.strictEqual(pool.isFree(obj1), true);
});

test('Pool: double release error', async () => {
  const pool = new metautil.Pool();
  pool.add({ a: 1 });

  const lease = await pool.capture();
  pool.release(lease);

  assert.throws(() => pool.release(lease), {
    message: 'Pool: release already released',
  });
  assert.throws(() => lease.release(), {
    message: 'Pool: release already released',
  });
});

test('Pool: release unexpected lease error', () => {
  const pool = new metautil.Pool();
  pool.add({ a: 1 });

  assert.throws(() => pool.release({}), {
    message: 'Pool: release unexpected lease',
  });
});

test('Pool: duplicate add error', () => {
  const pool = new metautil.Pool();
  const resource = { a: 1 };

  pool.add(resource);
  assert.throws(() => pool.add(resource), {
    message: 'Pool: add duplicates',
  });
});

test('Pool: waiting capture resolved after release', async () => {
  const pool = new metautil.Pool();

  const obj1 = { a: 1 };
  pool.add(obj1);
  const obj2 = { a: 2 };
  pool.add(obj2);

  const lease1 = await pool.capture();
  const lease2 = await pool.capture();

  const pending = pool.capture();
  pool.release(lease1);

  const lease3 = await pending;
  assert.strictEqual(lease3.resource, obj1);
  assert.strictEqual(pool.isFree(obj1), false);

  pool.release(lease2);
  pool.release(lease3);
});

test('Pool: timeout removes correct waiting item', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });

  const pool = new metautil.Pool({ timeout: 100 });

  const resource = { a: 1 };
  pool.add(resource);

  const held = await pool.capture();

  const expired = pool.capture().catch((error) => error);
  t.mock.timers.tick(50);
  const pending = pool.capture();

  t.mock.timers.tick(50);

  const error = await expired;
  assert.strictEqual(error.message, 'Pool next item timeout');

  pool.release(held);

  const lease = await pending;
  assert.strictEqual(lease.resource, resource);

  t.mock.timers.reset();
});
