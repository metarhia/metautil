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
    test.error(new Error('Should not be executed'));
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
    dc.abort();
  }, 100);

  try {
    await dc;
    test.error(new Error('Should not be executed'));
  } catch (error) {
    test.strictSame(error.message, 'The operation was aborted due to timeout');
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
    test.error(new Error('Should not be executed'));
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

metatests.test('Collector: wait for promise', async (test) => {
  const expectedResult = { key1: 'User: Marcus' };
  const dc = collect(['key1']);

  const promise = new Promise((resolve) => {
    setTimeout(() => resolve('User: Marcus'), 100);
  });
  dc.wait('key1', promise);

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

  const result = await dc;
  test.strictSame(result, expectedResult);
  test.end();
});

metatests.test('Collector: then chain', (test) => {
  const expectedResult = { key1: 1, key2: 2, key3: 3 };
  const dc = collect(['key1', 'key2']);

  dc.set('key1', 1);
  dc.set('key2', 2);

  dc.then((result) => ({ ...result, key3: 3 })).then((result) => {
    test.strictSame(result, expectedResult);
    test.end();
  });
});

metatests.test('Collector: error in then chain', (test) => {
  const expectedResult = new Error('expected error');
  const dc = collect(['key1', 'key2']);

  dc.set('key1', 1);
  dc.set('key2', 2);

  dc.then(() => {
    throw new Error('expected error');
  }).then(
    () => {
      test.error(new Error('Should not be executed'));
    },
    (error) => {
      test.strictSame(error.message, expectedResult.message);
      test.end();
    },
  );
});

metatests.test('Collector: reassign is off', async (test) => {
  test.plan(1);

  const expectedError = new Error('Collector reassign mode is off');
  const dc = collect(['key1', 'key2'], { reassign: false });

  dc.set('key1', 1);
  dc.set('key1', 5);
  dc.set('key2', 7);

  try {
    await dc;
    test.error(new Error('Should not be executed'));
  } catch (error) {
    test.strictSame(error.message, expectedError.message);
  }
});

metatests.test('Collector: abort', async (test) => {
  const dc = collect(['key1', 'key2'], { timeout: 200 });

  setTimeout(() => {
    dc.set('key1', 1);
  }, 50);

  setTimeout(() => {
    dc.abort();
  }, 100);

  dc.signal.addEventListener('abort', (event) => {
    test.strictSame(event.type, 'abort');
    test.assert(dc.signal.reason instanceof DOMException);
    test.strictSame(dc.signal.reason.name, 'AbortError');
  });

  try {
    await dc;
    test.error(new Error('Should not be executed'));
  } catch (error) {
    test.strictSame(error.message, 'Collector aborted');
    test.end();
  }
});
