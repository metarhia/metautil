'use strict';

const { collect } = require('..');
const metatests = require('metatests');
const { Schema } = require('metaschema');

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
    (result) => result,
    (error) => {
      test.strictSame(error.message, expectedResult.message);
      test.end();
    },
  );
});

metatests.test('Collector: collect with schema validation', async (test) => {
  const schema = Schema.from({
    firstname: 'string',
    lastname: 'string',
  });
  const ac1 = collect(['firstname', 'lastname'], { schema });

  ac1.set('firstname', undefined);
  ac1.set('lastname', 1);

  const expectedResult1 = new Error(
    'Invalid keys type: Field "firstname" not of expected type: string; Field "lastname" not of expected type: string',
  );

  try {
    await ac1;
  } catch (error) {
    test.strictSame(error.message, expectedResult1.message);
  }

  const ac2 = collect(['firstname', 'lastname'], {
    schema,
    exact: false,
  });

  ac2.set('fullName', 'Michael Jordan');
  ac2.set('firstname', 'Michael');
  ac2.set('lastname', 'Jordan');

  const expectedResult2 = new Error(
    'Invalid keys type: Field "fullName" is not expected',
  );
  try {
    await ac2;
  } catch (error) {
    test.strictSame(error.message, expectedResult2.message);
  }

  test.end();
});

metatests.test(
  'Collector: compose collect with schema validation',
  async (test) => {
    const schema = Schema.from({
      id: 'number',
      profile: {
        firstname: 'string',
        lastname: 'string',
        fullName: { type: 'string', required: false },
        age: 'number',
      },
    });

    const ac1 = collect(['id', 'profile'], { schema });
    const profile1 = collect(['firstname', 'lastname', 'fullName', 'age']);

    ac1.collect({ profile: profile1 });
    ac1.set('id', 1);
    profile1.set('firstname', 'Michael');
    profile1.set('lastname', 'Jordan');
    profile1.set('fullName', undefined);
    profile1.set('age', 60);

    const expectedResult1 = {
      id: 1,
      profile: {
        firstname: 'Michael',
        lastname: 'Jordan',
        fullName: undefined,
        age: 60,
      },
    };

    const result1 = await ac1;

    test.strictSame(result1, expectedResult1);

    const ac2 = collect(['id', 'profile'], { schema });
    const profile2 = collect(['firstname', 'lastname', 'fullName', 'age']);

    ac2.collect({ profile: profile2 });
    ac2.set('id', 'string');
    profile2.set('firstname', undefined);
    profile2.set('lastname', 'Jordan');
    profile2.set('fullName', undefined);
    profile2.set('age', 'string');

    const expectedResult2 = new Error(
      'Invalid keys type: Field "id" not of expected type: number; Field "profile.firstname" not of expected type: string; Field "profile.age" not of expected type: number',
    );

    try {
      await ac2;
    } catch (error) {
      test.strictSame(error.message, expectedResult2.message);
    }

    test.end();
  },
);
