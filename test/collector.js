'use strict';

const test = require('node:test');
const assert = require('node:assert');

const { collect } = require('..');

test('Collector: keys', async () => {
  const expectedResult = { key1: 1, key2: 2 };
  const dc = collect(['key1', 'key2']);

  setTimeout(() => {
    dc.set('key1', 1);
  }, 50);

  setTimeout(() => {
    dc.set('key2', 2);
  }, 100);

  const result = await dc;
  assert.deepStrictEqual(result, expectedResult);
});

test('Collector: exact', async () => {
  const dc = collect(['key1', 'key2']);

  setTimeout(() => {
    dc.set('wrongKey', 'someVal');
  }, 50);

  await assert.rejects(async () => dc, { message: 'Unexpected key: wrongKey' });
});

test('Collector: not exact', async () => {
  const expectedResult = { key1: 1, wrongKey: 'someVal', key2: 2 };
  const dc = collect(['key1', 'key2'], { exact: false });

  setTimeout(() => {
    dc.set('key1', 1);
  }, 50);

  setTimeout(() => {
    dc.set('wrongKey', 'someVal');
  }, 75);

  setTimeout(() => {
    dc.set('key2', 2);
  }, 100);

  try {
    const result = await dc;
    assert.deepStrictEqual(result, expectedResult);
  } catch (error) {
    assert.ifError(error);
  }
});

test('Collector: set after done is ignored', async () => {
  const dc = collect(['key1'], { exact: false, reassign: true });
  dc.set('key1', 1);
  dc.set('key1', 2);
  dc.set('key2', 2);
  assert.strictEqual(dc.done, true);
  assert.deepStrictEqual(await dc, { key1: 1 });
});

test('Collector: timeout', async () => {
  const dc = collect(['key1'], { timeout: 50 });
  assert.strictEqual(dc.timeout, 50);

  setTimeout(() => {
    dc.set('key1', 1);
    dc.abort();
  }, 100);

  dc.signal.addEventListener('abort', (event) => {
    assert.strictEqual(event.type, 'abort');
    assert(dc.signal.reason instanceof DOMException);
    assert.strictEqual(dc.signal.reason.name, 'TimeoutError');
  });

  await assert.rejects(async () => dc, {
    message: 'The operation was aborted due to timeout',
  });
});

test('Collector: default values', async () => {
  const defaults = { key1: 1 };

  const dc1 = collect(['key1'], { defaults, timeout: 50 });
  const dc2 = collect(['key1'], { defaults: {}, timeout: 50 });
  const dc3 = collect(['key1', 'key2'], { defaults, timeout: 50 });
  dc3.set('key2', 1);

  setTimeout(() => {
    dc1.set('key1', 2);
    dc2.set('key1', 2);
    dc3.set('key1', 2);
  }, 100);

  const result1 = await dc1;
  assert.deepStrictEqual(result1, defaults);
  const result3 = await dc3;
  assert.deepStrictEqual(result3, { ...defaults, key2: 1 });

  await assert.rejects(async () => dc2, {
    message: 'The operation was aborted due to timeout',
  });
});

test('Collector: fail', async () => {
  const dc = collect(['key1']);

  setTimeout(() => {
    dc.fail(new Error('Custom error'));
  }, 50);

  await assert.rejects(async () => dc, { message: 'Custom error' });
});

test('Collector: take', async () => {
  const expectedResult = { key1: 'User: Marcus' };
  const dc = collect(['key1']);

  const fn = (name, callback) => {
    setTimeout(() => {
      callback(null, `User: ${name}`);
    }, 100);
  };
  dc.take('key1', fn, 'Marcus');

  const result = await dc;
  assert.deepStrictEqual(result, expectedResult);
});

test('Collector: wait', async () => {
  const expectedResult = { key1: 'User: Marcus' };
  const dc = collect(['key1']);

  const fn = async (name) =>
    new Promise((resolve) => {
      setTimeout(() => resolve(`User: ${name}`), 100);
    });
  dc.wait('key1', fn, 'Marcus');

  const result = await dc;
  assert.deepStrictEqual(result, expectedResult);
});

test('Collector: wait for promise', async () => {
  const expectedResult = { key1: 'User: Marcus' };
  const dc = collect(['key1']);

  const promise = new Promise((resolve) => {
    setTimeout(() => resolve('User: Marcus'), 100);
  });
  dc.wait('key1', promise);

  const result = await dc;
  assert.deepStrictEqual(result, expectedResult);
});

test('Collector: compose collect', async () => {
  const expectedResult = { key1: { sub1: 11 }, key2: 2, key3: { sub3: 31 } };
  const dc = collect(['key1', 'key2', 'key3']);
  const key1 = collect(['sub1']);
  const key3 = collect(['sub3']);
  dc.collect({ key1, key3 });

  setTimeout(() => {
    key1.set('sub1', 11);
  }, 50);

  setTimeout(() => {
    dc.set('key2', 2);
  }, 100);

  setTimeout(() => {
    key3.set('sub3', 31);
  }, 150);

  const result = await dc;
  assert.deepStrictEqual(result, expectedResult);
});

test('Collector: completed before await', async () => {
  const expectedResult = { key1: 1, key2: 2 };
  const dc = collect(['key1', 'key2']);

  dc.set('key1', 1);
  dc.set('key2', 2);

  const result = await dc;
  assert.deepStrictEqual(result, expectedResult);
});

test('Collector: then chain', async () => {
  const dc = collect(['key1', 'key2']);
  dc.set('key1', 1);
  dc.set('key2', 2);
  const result = await dc.then((data) => ({ ...data, key3: 3 }));
  assert.deepStrictEqual(result, { key1: 1, key2: 2, key3: 3 });
});

test('Collector: error in then chain', async () => {
  const dc = collect(['key1', 'key2']);
  dc.set('key1', 1);
  dc.set('key2', 2);
  const chained = dc.then(() => {
    throw new Error('expected error');
  });
  await assert.rejects(chained, { message: 'expected error' });
});

test('Collector: reassign is off', async () => {
  const dc = collect(['key1', 'key2'], { reassign: false });

  dc.set('key1', 1);
  dc.set('key1', 5);
  dc.set('key2', 7);

  await assert.rejects(async () => dc, {
    message: 'Collector reassign mode is off',
  });
});

test('Collector: reassign is on', async () => {
  const dc = collect(['key1', 'key2'], { reassign: true });
  dc.set('key1', 1);
  dc.set('key1', 5);
  dc.set('key2', 7);
  const result = await dc;
  assert.deepStrictEqual(result, { key1: 5, key2: 7 });
});

test('Collector: abort', async () => {
  const dc = collect(['key1', 'key2'], { timeout: 200 });

  setTimeout(() => {
    dc.set('key1', 1);
  }, 50);

  setTimeout(() => {
    dc.abort();
  }, 100);

  dc.signal.addEventListener('abort', (event) => {
    assert.strictEqual(event.type, 'abort');
    assert(dc.signal.reason instanceof DOMException);
    assert.strictEqual(dc.signal.reason.name, 'AbortError');
  });

  await assert.rejects(async () => dc, { message: 'Collector aborted' });
});

test('Collector: validate scheme(valid)', async () => {
  const from = (schema) => (data) => {
    for (const [key, value] of Object.entries(data)) {
      const type = schema[key];
      if (type && typeof value === type) continue;
      throw new Error('Schema validate error');
    }
  };

  const schema = {
    key1: 'number',
    key2: 'number',
  };

  const dc = collect(['key1', 'key2'], { validate: from(schema) });

  dc.set('key1', 1);
  dc.set('key2', 2);

  assert.deepStrictEqual(await dc, { key1: 1, key2: 2 });
});

test('Collector: validate scheme(invalid)', async () => {
  const from = (schema) => (data) => {
    for (const [key, value] of Object.entries(data)) {
      const type = schema[key];
      if (type && typeof value === type) continue;
      throw new Error('Schema validate error');
    }
  };

  const schema = {
    key1: 'number',
    key2: 'string',
  };

  const dc = collect(['key1', 'key2'], { validate: from(schema) });

  dc.set('key1', 1);
  dc.set('key2', 2);

  await assert.rejects(async () => dc, { message: 'Schema validate error' });
});
