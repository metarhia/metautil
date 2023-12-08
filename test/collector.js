'use strict';

const { collect } = require('..');
const metatests = require('metatests');

metatests.test('Collector: keys', async (test) => {
  const expectedResult = { key1: 1, key2: 2 };
  const dc = collect(['key1', 'key2']);

  setTimeout(() => {
    dc.set('key1', 1);
  }, 50);

  setTimeout(() => {
    dc.set('key2', 2);
  }, 100);

  const result = await dc;
  test.strictSame(result, expectedResult);
  test.end();
});

metatests.test('Collector: exact', async (test) => {
  const dc = collect(['key1', 'key2']);

  setTimeout(() => {
    dc.set('wrongKey', 'someVal');
  }, 50);

  try {
    await dc;
  } catch (error) {
    test.strictSame(error.message, 'Unexpected key: wrongKey');
    test.end();
  }
});

metatests.test('Collector: not exact', async (test) => {
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
    test.strictSame(result, expectedResult);
    test.end();
  } catch (error) {
    test.error(error);
  }
});

metatests.test('Collector: set after done', async (test) => {
  const expectedResult = { key1: 1 };
  const dc = collect(['key1']);

  setTimeout(() => {
    dc.set('key1', 1);
  }, 50);

  setTimeout(() => {
    dc.set('key2', 2);
  }, 75);

  const result = await dc;
  test.strictSame(result, expectedResult);

  setTimeout(() => {
    dc.set('key3', 3);
  }, 100);

  test.end();
});

metatests.test('Collector: timeout', async (test) => {
  const dc = collect(['key1'], { timeout: 50 });

  setTimeout(() => {
    dc.set('key1', 1);
  }, 100);

  try {
    await dc;
  } catch (error) {
    test.strictSame(error.message, 'Collector timed out');
    test.end();
  }
});

metatests.test('Collector: fail', async (test) => {
  const dc = collect(['key1']);

  setTimeout(() => {
    dc.fail(new Error('Custom error'));
  }, 50);

  try {
    await dc;
  } catch (error) {
    test.strictSame(error.message, 'Custom error');
    test.end();
  }
});

metatests.test('Collector: take', async (test) => {
  const expectedResult = { key1: 'User: Marcus' };
  const dc = collect(['key1']);

  const fn = (name, callback) => {
    setTimeout(() => {
      callback(null, `User: ${name}`);
    }, 100);
  };
  dc.take('key1', fn, 'Marcus');

  const result = await dc;
  test.strictSame(result, expectedResult);
  test.end();
});

metatests.test('Collector: wait', async (test) => {
  const expectedResult = { key1: 'User: Marcus' };
  const dc = collect(['key1']);

  const fn = async (name) =>
    new Promise((resolve) => {
      setTimeout(() => resolve(`User: ${name}`), 100);
    });
  dc.wait('key1', fn, 'Marcus');

  const result = await dc;
  test.strictSame(result, expectedResult);
  test.end();
});

metatests.test('Collector: compose collect', async (test) => {
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
  test.strictSame(result, expectedResult);
  test.end();
});

metatests.test('Collector: after done', async (test) => {
  const expectedResult = { key1: 1, key2: 2 };
  const dc = collect(['key1', 'key2']);

  dc.set('key1', 1);
  dc.set('key2', 2);

  dc.on('done', (result) => {
    test.strictSame(result, expectedResult);
  });

  const result = await dc;
  test.strictSame(result, expectedResult);
  test.end();
});
