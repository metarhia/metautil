'use strict';

const { collect } = require('..');
const metatests = require('metatests');

metatests.test('Collector: keys', async (test) => {
  const expectedResult = { key1: 1, key2: 2 };
  const dc = collect(['key1', 'key2']);

  setTimeout(() => {
    dc.pick('key1', 1);
    dc.pick('key2', 2);
  }, 100);

  dc.on('done', (result) => {
    test.strictSame(result, expectedResult);
  });

  const result = await dc;
  test.strictSame(result, expectedResult);
  test.end();
});

metatests.test('Collector: distinct', async (test) => {
  const dc = collect(['key1', 'key2']);

  setTimeout(() => {
    dc.pick('key1', 1);
    dc.pick('wrongKey', 'someVal');
  }, 100);

  dc.on('fail', (error) => {
    test.strictSame(error.message, 'Unexpected key: wrongKey');
  });

  try {
    await dc;
  } catch (error) {
    test.strictSame(error.message, 'Unexpected key: wrongKey');
    test.end();
  }
});

metatests.test('Collector: not distinct', async (test) => {
  const expectedResult = { key1: 1, wrongKey: 'someVal', key2: 2 };
  const dc = collect(['key1', 'key2']).distinct(false);

  setTimeout(() => {
    dc.pick('key1', 1);
    dc.pick('wrongKey', 'someVal');
    dc.pick('key2', 2);
  }, 100);

  try {
    const result = await dc;
    test.strictSame(result, expectedResult);
    test.end();
  } catch (error) {
    test.error(error);
  }
});

metatests.test('Collector: not distinct options', async (test) => {
  const expectedResult = { key1: 1, wrongKey: 'someVal', key2: 2 };
  const dc = collect(['key1', 'key2'], { distinct: false });

  setTimeout(() => {
    dc.pick('key1', 1);
    dc.pick('wrongKey', 'someVal');
    dc.pick('key2', 2);
  }, 100);

  try {
    const result = await dc;
    test.strictSame(result, expectedResult);
    test.end();
  } catch (error) {
    test.error(error);
  }
});

metatests.test('Collector: pick after done', async (test) => {
  const expectedResult = { key1: 1 };
  const dc = collect(['key1']);

  setTimeout(() => {
    dc.pick('key1', 1);
    dc.pick('key2', 2);
  }, 100);

  const result = await dc;
  test.strictSame(result, expectedResult);
  test.end();
});

metatests.test('Collector: timeout', async (test) => {
  const dc = collect(['key1']).timeout(50);

  setTimeout(() => {
    dc.pick('key1', 1);
  }, 100);

  try {
    await dc;
  } catch (error) {
    test.strictSame(error.message, 'Collector timed out');
    test.end();
  }
});

metatests.test('Collector: timeout options', async (test) => {
  const dc = collect(['key1'], { timeout: 50 });

  setTimeout(() => {
    dc.pick('key1', 1);
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
