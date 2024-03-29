'use strict';

const metatests = require('metatests');
const metautil = require('..');

metatests.test('Object: makePrivate', (test) => {
  const obj = {
    field: 'value',
    CONSTANT: 1000,
    method(a, b) {
      return a + b;
    },
  };
  const iface = metautil.makePrivate(obj);
  test.strictSame(typeof iface, 'object');
  test.strictSame(obj === iface, false);
  test.strictSame(iface.field, undefined);
  test.strictSame(iface.CONSTANT, 1000);
  test.strictSame(typeof iface.method, 'function');
  test.strictSame(iface.method(3, 5), 8);
  test.end();
});

metatests.test('Object: protect', (test) => {
  const obj1 = {
    field1: 'value1',
    module1: {
      method(a, b) {
        return a + b;
      },
    },
  };
  const obj2 = {
    field2: 'value2',
    module2: {
      method(a, b) {
        return a + b;
      },
    },
  };
  metautil.protect(['module1'], obj1, obj2);
  try {
    obj1.field1 = 100;
    test.strictSame(obj1.field1, 100);
    obj1.module1.method = () => {};
    test.strictSame(obj1.module1.method(3, 5), undefined);
  } catch (err) {
    test.error(err);
  }
  try {
    obj2.field1 = 200;
    test.strictSame(obj2.field1, 200);
    obj2.module2.method = () => {};
    test.strictSame(obj2.module2.method(3, 5), 8);
  } catch (err) {
    test.strictSame(err.constructor.name, 'TypeError');
  }
  test.end();
});

metatests.test('Introspection: getSignature', async (test) => {
  const method = ({ a, b, c }) => ({ a, b, c });
  const signature = metautil.getSignature(method);
  test.strictSame(signature, ['a', 'b', 'c']);
  test.end();
});

metatests.case(
  'Serialization',
  { metautil },
  {
    'metautil.jsonParse': [
      ['{}', {}],
      ['{ "a": 5 }', { a: 5 }],
      ['{', null],
      ['', null],
    ],
  },
);

metatests.test('Object: flatFields with keys names', (test) => {
  const source = {
    name: { first: 'Andrew', second: 'Johnson' },
    old: true,
    parent: { mother: 'Eva', father: 'Adam' },
    grandParent: { grandmother: 'Kate', grandfather: 'Fill' },
  };
  const expected = {
    nameFirst: 'Andrew',
    nameSecond: 'Johnson',
    old: true,
    parentMother: 'Eva',
    parentFather: 'Adam',
    grandParent: { grandmother: 'Kate', grandfather: 'Fill' },
  };

  const result = metautil.flatObject(source, ['name', 'parent']);

  test.strictSame(result, expected);
  test.end();
});

metatests.test('Object: flatFields duplicate key', (test) => {
  const source = {
    name: { first: 'Andrew', second: 'Johnson' },
    nameFirst: 'Andrew',
    old: true,
    parent: { mother: 'Eva', father: 'Adam' },
  };

  test.throws(
    () => metautil.flatObject(source),
    new Error('Can not combine keys: key "nameFirst" already exists'),
  );

  test.end();
});

metatests.test('Object: unflatFields with key names', (test) => {
  const fieldNames = ['name', 'parent'];

  const source = {
    nameFirst: 'Andrew',
    nameSecond: 'Johnson',
    old: true,
    avoid: [1, 2, 3],
    parentMother: 'Eva',
    parentFather: 'Adam',
  };

  const expected = {
    name: { first: 'Andrew', second: 'Johnson' },
    old: true,
    avoid: [1, 2, 3],
    parent: { mother: 'Eva', father: 'Adam' },
  };

  const result = metautil.unflatObject(source, fieldNames);

  test.strictSame(result, expected);
  test.end();
});

metatests.test('Object: unflatFields naming collision', (test) => {
  const fieldNames = ['name', 'parent'];

  const source = {
    nameFirst: 'Andrew',
    nameSecond: 'Johnson',
    old: true,
    avoid: [1, 2, 3],
    name: 'John',
    parentMother: 'Eva',
    parentFather: 'Adam',
  };

  test.throws(
    () => metautil.unflatObject(source, fieldNames),
    new Error('Can not combine keys: key "name" already exists'),
  );

  test.end();
});

metatests.test('Object: namespaceByPath', (test) => {
  const ns = {
    module1: {
      method(a, b) {
        return a + b;
      },
    },
    module2: {
      method(a, b) {
        return a + b;
      },
    },
  };
  const ent1 = metautil.namespaceByPath(ns, 'module2.method');
  test.strictSame(ent1, ns.module2.method);
  const ent2 = metautil.namespaceByPath(ns, 'module1.unknown');
  test.strictSame(ent2, null);
  const ent3 = metautil.namespaceByPath(ns, 'module3.method');
  test.strictSame(ent3, null);
  const ent4 = metautil.namespaceByPath(ns, 'unknown.unknown');
  test.strictSame(ent4, null);
  const ent5 = metautil.namespaceByPath(ns, 'module1');
  test.strictSame(ent5, ns.module1);
  const ent6 = metautil.namespaceByPath(ns, 'module3');
  test.strictSame(ent6, null);
  const ent7 = metautil.namespaceByPath(ns, '');
  test.strictSame(ent7, null);
  test.end();
});

metatests.test('Object: flatFields', (test) => {
  const source = {
    name: { first: 'Andrew', second: 'Johnson' },
    old: true,
    avoid: [1, 2, 3],
    parent: { mother: 'Eva', father: 'Adam' },
  };
  const expected = {
    nameFirst: 'Andrew',
    nameSecond: 'Johnson',
    old: true,
    avoid: [1, 2, 3],
    parentMother: 'Eva',
    parentFather: 'Adam',
  };

  const result = metautil.flatObject(source);

  test.strictSame(result, expected);
  test.end();
});

metatests.case(
  'Object: serializeArguments',
  { metautil },
  {
    'metautil.serializeArguments': [
      [['a', 'b'], { a: 1, b: 2 }, '{"a":1,"b":2}'],
      [['a', 'b', 'c'], { a: 1, b: 2 }, '{"a":1,"b":2}'],
      [['a', 'b'], { a: 1, b: 2, c: 3 }, '{"a":1,"b":2}'],
      [[], { a: 1, b: 2 }, '{}'],
      [['a', 'b'], {}, '{}'],
    ],
  },
);
