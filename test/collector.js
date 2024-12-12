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

  try {
    await dc;
    assert.ifError(new Error('Should not be executed'));
  } catch (error) {
    assert.strictEqual(error.message, 'Unexpected key: wrongKey');
  }
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

test('Collector: set after done', async () => {
  const expectedResult = { key1: 1 };
  const dc = collect(['key1']);

  setTimeout(() => {
    dc.set('key1', 1);
  }, 50);

  setTimeout(() => {
    dc.set('key2', 2);
  }, 75);

  const result = await dc;
  assert.deepStrictEqual(result, expectedResult);

  setTimeout(() => {
    dc.set('key3', 3);
  }, 100);
});

test('Collector: timeout', async () => {
  const dc = collect(['key1'], { timeout: 50 });

  setTimeout(() => {
    dc.set('key1', 1);
    dc.abort();
  }, 100);

  dc.signal.addEventListener('abort', (event) => {
    assert.strictEqual(event.type, 'abort');
    assert(dc.signal.reason instanceof DOMException);
    assert.strictEqual(dc.signal.reason.name, 'TimeoutError');
  });

  try {
    await dc;
    assert.ifError(new Error('Should not be executed'));
  } catch (error) {
    assert.strictEqual(
      error.message,
      'The operation was aborted due to timeout',
    );
  }
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

  try {
    await dc2;
    assert.ifError(new Error('Should not be executed'));
  } catch (error) {
    assert.strictEqual(
      error.message,
      'The operation was aborted due to timeout',
    );
  }
});

test('Collector: fail', async () => {
  const dc = collect(['key1']);

  setTimeout(() => {
    dc.fail(new Error('Custom error'));
  }, 50);

  try {
    await dc;
    assert.ifError(new Error('Should not be executed'));
  } catch (error) {
    assert.strictEqual(error.message, 'Custom error');
  }
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

test('Collector: after done', async () => {
  const expectedResult = { key1: 1, key2: 2 };
  const dc = collect(['key1', 'key2']);

  dc.set('key1', 1);
  dc.set('key2', 2);

  const result = await dc;
  assert.deepStrictEqual(result, expectedResult);
});

test('Collector: then chain', () => {
  const expectedResult = { key1: 1, key2: 2, key3: 3 };
  const dc = collect(['key1', 'key2']);

  dc.set('key1', 1);
  dc.set('key2', 2);

  dc.then((result) => ({ ...result, key3: 3 })).then((result) => {
    assert.deepStrictEqual(result, expectedResult);
  });
});

test('Collector: error in then chain', () => {
  const expectedResult = new Error('expected error');
  const dc = collect(['key1', 'key2']);

  dc.set('key1', 1);
  dc.set('key2', 2);

  dc.then(() => {
    throw new Error('expected error');
  }).then(
    () => {
      assert.ifError(new Error('Should not be executed'));
    },
    (error) => {
      assert.strictEqual(error.message, expectedResult.message);
    },
  );
});

test('Collector: reassign is off', async () => {
  const expectedError = new Error('Collector reassign mode is off');
  const dc = collect(['key1', 'key2'], { reassign: false });

  dc.set('key1', 1);
  dc.set('key1', 5);
  dc.set('key2', 7);

  try {
    await dc;
    assert.ifError(new Error('Should not be executed'));
  } catch (error) {
    assert.strictEqual(error.message, expectedError.message);
  }
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

  try {
    await dc;
    assert.ifError(new Error('Should not be executed'));
  } catch (error) {
    assert.strictEqual(error.message, 'Collector aborted');
  }
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

  try {
    await dc;
  } catch {
    assert.ifError(new Error('Should not be executed'));
  }
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

  try {
    await dc;
    assert.ifError(new Error('Should not be executed'));
  } catch (error) {
    assert.strictEqual(error.message, 'Schema validate error');
  }
});
