'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { collect } = require('..');

// AbortSignal.timeout() uses an internal timer that is never ref'd, so on
// Node.js versions before 24 it does not by itself keep the event loop (and
// thus the test) alive long enough to fire. Tests that rely solely on
// Collector's `timeout` option, with no other pending work, need a harmless
// ref'd timer to keep the process alive until the abort fires.
const keepEventLoopAlive = (ms) => setTimeout(() => {}, ms);

test('Collector: create collector', () => {
  const dc = collect(['key1', 'key2']);

  assert.strictEqual(dc.done, false);
  assert.strictEqual(dc.count, 0);
  assert.deepStrictEqual(dc.keys, ['key1', 'key2']);
  assert.deepStrictEqual(dc.data, {});
});

test('Collector: collect values with set', async () => {
  const dc = collect(['key1', 'key2']);

  dc.set('key1', 1);
  dc.set('key2', 2);

  assert.deepStrictEqual(await dc, { key1: 1, key2: 2 });
});

test('Collector: reject unexpected key in exact mode', async () => {
  const dc = collect(['key1', 'key2']);
  dc.set('wrongKey', 'value');

  await assert.rejects(async () => dc, { message: 'Unexpected key: wrongKey' });
});

test('Collector: allow unexpected key when exact is disabled', async () => {
  const dc = collect(['key1', 'key2'], { exact: false });

  dc.set('key1', 1);
  dc.set('extra', 'value');
  dc.set('key2', 2);

  assert.deepStrictEqual(await dc, { key1: 1, extra: 'value', key2: 2 });
});

test('Collector: reject duplicate key when reassign is disabled', async () => {
  const dc = collect(['key1', 'key2'], { reassign: false });

  dc.set('key1', 1);
  dc.set('key1', 5);

  await assert.rejects(async () => dc, {
    message: 'Collector reassign mode is off',
  });
});

test('Collector: allow duplicate key when reassign is enabled', async () => {
  const dc = collect(['key1', 'key2'], { reassign: true });

  dc.set('key1', 1);
  dc.set('key1', 2);
  dc.set('key2', 3);

  assert.deepStrictEqual(await dc, { key1: 2, key2: 3 });
});

test('Collector: resolve after all expected keys are collected', async () => {
  const dc = collect(['key1', 'key2']);

  setTimeout(() => dc.set('key1', 1), 50);
  setTimeout(() => dc.set('key2', 2), 100);

  assert.deepStrictEqual(await dc, { key1: 1, key2: 2 });
});

test('Collector: take collects callback result', async () => {
  const dc = collect(['key1']);

  const fn = (name, callback) => {
    setTimeout(() => callback(null, `User: ${name}`), 50);
  };
  dc.take('key1', fn, 'Marcus');

  assert.deepStrictEqual(await dc, { key1: 'User: Marcus' });
});

test('Collector: wait collects promise result', async () => {
  const dc = collect(['key1']);

  const fn = (name) =>
    new Promise((resolve) => {
      setTimeout(() => resolve(`User: ${name}`), 50);
    });
  dc.wait('key1', fn, 'Marcus');

  assert.deepStrictEqual(await dc, { key1: 'User: Marcus' });
});

test('Collector: wait collects direct promise', async () => {
  const dc = collect(['key1']);

  const promise = new Promise((resolve) => {
    setTimeout(() => resolve('User: Marcus'), 50);
  });
  dc.wait('key1', promise);

  assert.deepStrictEqual(await dc, { key1: 'User: Marcus' });
});

test('Collector: collect multiple thenables', async () => {
  const dc = collect(['key1', 'key2', 'key3']);
  const key1 = collect(['sub1']);
  const key3 = collect(['sub3']);
  dc.collect({ key1, key3 });

  setTimeout(() => key1.set('sub1', 11), 50);
  setTimeout(() => dc.set('key2', 2), 100);
  setTimeout(() => key3.set('sub3', 31), 150);

  assert.deepStrictEqual(await dc, {
    key1: { sub1: 11 },
    key2: 2,
    key3: { sub3: 31 },
  });
});

test('Collector: timeout applies defaults', async () => {
  const defaults = { key1: 1 };
  const dc = collect(['key1'], { defaults, timeout: 50 });

  keepEventLoopAlive(100);
  assert.deepStrictEqual(await dc, defaults);
});

test('Collector: timeout rejects when defaults are not enough', async () => {
  const dc = collect(['key1', 'key2'], { defaults: { key1: 1 }, timeout: 50 });

  keepEventLoopAlive(100);
  await assert.rejects(async () => dc, {
    message: 'The operation was aborted due to timeout',
  });
});

test('Collector: abort rejects', async () => {
  const dc = collect(['key1', 'key2'], { timeout: 200 });

  setTimeout(() => dc.set('key1', 1), 50);
  setTimeout(() => dc.abort(), 100);

  await assert.rejects(async () => dc, { message: 'Collector aborted' });
});

test('Collector: validation success resolves', async () => {
  const validate = (data) => {
    if (typeof data.key1 !== 'number') throw new Error('invalid');
  };
  const dc = collect(['key1'], { validate });

  dc.set('key1', 1);

  assert.deepStrictEqual(await dc, { key1: 1 });
});

test('Collector: validation error rejects', async () => {
  const validate = () => {
    throw new Error('Schema validate error');
  };
  const dc = collect(['key1', 'key2'], { validate });

  dc.set('key1', 1);
  dc.set('key2', 2);

  await assert.rejects(async () => dc, { message: 'Schema validate error' });
});

test('Collector: public mutable fields are not exposed', () => {
  const dc = collect(['key1'], { validate: () => {} });

  assert.strictEqual(Object.hasOwn(dc, 'data'), false);
  assert.strictEqual('exact' in dc, false);
  assert.strictEqual('reassign' in dc, false);
  assert.strictEqual('timeout' in dc, false);
  assert.strictEqual('defaults' in dc, false);
  assert.strictEqual('validate' in dc, false);
  assert.strictEqual(typeof dc.done, 'boolean');
  assert.strictEqual(typeof dc.count, 'number');
});

test('Collector: getters do not expose mutable references', () => {
  const dc = collect(['key1']);
  dc.set('key1', 1);

  const keys = dc.keys;
  const data = dc.data;

  keys.push('key2');
  data.key2 = 2;

  assert.deepStrictEqual(dc.keys, ['key1']);
  assert.deepStrictEqual(dc.data, { key1: 1 });
});

test('Collector: set after done', async () => {
  const dc = collect(['key1']);

  dc.set('key1', 1);
  assert.deepStrictEqual(await dc, { key1: 1 });

  dc.set('key2', 2);
  assert.deepStrictEqual(dc.data, { key1: 1 });
});

test('Collector: fail', async () => {
  const dc = collect(['key1']);

  setTimeout(() => dc.fail(new Error('Custom error')), 50);

  await assert.rejects(async () => dc, { message: 'Custom error' });
});

test('Collector: then chain', async () => {
  const dc = collect(['key1', 'key2']);

  dc.set('key1', 1);
  dc.set('key2', 2);

  const result = await dc.then((value) => ({ ...value, key3: 3 }));
  assert.deepStrictEqual(result, { key1: 1, key2: 2, key3: 3 });
});

test('Collector: error in then chain', async () => {
  const dc = collect(['key1', 'key2']);

  dc.set('key1', 1);
  dc.set('key2', 2);

  await assert.rejects(
    dc.then(() => {
      throw new Error('expected error');
    }),
    { message: 'expected error' },
  );
});
