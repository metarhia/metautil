'use strict';

const test = require('node:test');
const assert = require('node:assert');
const metatests = require('metatests');
const metautil = require('..');

test('Object: makePrivate', () => {
  const obj = {
    field: 'value',
    CONSTANT: 1000,
    method(a, b) {
      return a + b;
    },
  };
  const iface = metautil.makePrivate(obj);
  assert.strictEqual(typeof iface, 'object');
  assert.strictEqual(obj === iface, false);
  assert.strictEqual(iface.field, undefined);
  assert.strictEqual(iface.CONSTANT, 1000);
  assert.strictEqual(typeof iface.method, 'function');
  assert.strictEqual(iface.method(3, 5), 8);
});

test('Object: protect', () => {
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
    assert.strictEqual(obj1.field1, 100);
    obj1.module1.method = () => {};
    assert.strictEqual(obj1.module1.method(3, 5), undefined);
  } catch (err) {
    assert.ifError(err);
  }
  try {
    obj2.field1 = 200;
    assert.strictEqual(obj2.field1, 200);
    obj2.module2.method = () => {};
    assert.strictEqual(obj2.module2.method(3, 5), 8);
  } catch (err) {
    assert.strictEqual(err.constructor.name, 'TypeError');
  }
});

test('Introspection: getSignature', async () => {
  const method = ({ a, b, c }) => ({ a, b, c });
  const signature = metautil.getSignature(method);
  assert.deepStrictEqual(signature, ['a', 'b', 'c']);
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

test('Object: flatFields with keys names', () => {
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

  assert.deepStrictEqual(result, expected);
});

test('Object: flatFields duplicate key', () => {
  const source = {
    name: { first: 'Andrew', second: 'Johnson' },
    nameFirst: 'Andrew',
    old: true,
    parent: { mother: 'Eva', father: 'Adam' },
  };

  assert.throws(
    () => metautil.flatObject(source),
    new Error('Can not combine keys: key "nameFirst" already exists'),
  );
});

test('Object: unflatFields with key names', () => {
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

  assert.deepStrictEqual(result, expected);
});

test('Object: unflatFields naming collision', () => {
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

  assert.throws(
    () => metautil.unflatObject(source, fieldNames),
    new Error('Can not combine keys: key "name" already exists'),
  );
});

test('Object: namespaceByPath', () => {
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
  assert.strictEqual(ent1, ns.module2.method);
  const ent2 = metautil.namespaceByPath(ns, 'module1.unknown');
  assert.strictEqual(ent2, null);
  const ent3 = metautil.namespaceByPath(ns, 'module3.method');
  assert.strictEqual(ent3, null);
  const ent4 = metautil.namespaceByPath(ns, 'unknown.unknown');
  assert.strictEqual(ent4, null);
  const ent5 = metautil.namespaceByPath(ns, 'module1');
  assert.strictEqual(ent5, ns.module1);
  const ent6 = metautil.namespaceByPath(ns, 'module3');
  assert.strictEqual(ent6, null);
  const ent7 = metautil.namespaceByPath(ns, '');
  assert.strictEqual(ent7, null);
});

test('Object: flatFields', () => {
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

  assert.deepStrictEqual(result, expected);
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

test('Object: firstKey', () => {
  const obj1 = { '1key': 'value1', Akey: 'value2', bkey: 'value3' };
  assert.strictEqual(metautil.firstKey(obj1), 'Akey');

  const obj2 = { 1: 'value1', 2: 'value2', 3: 'value3' };
  assert.strictEqual(metautil.firstKey(obj2), undefined);

  const obj3 = {};
  assert.strictEqual(metautil.firstKey(obj3), undefined);

  const obj4 = { 1: 'value1', a: 'value2', B: 'value3', c: 'value4' };
  assert.strictEqual(metautil.firstKey(obj4), 'a');

  const obj5 = { Z: 'value1', A: 'value2', B: 'value3' };
  assert.strictEqual(metautil.firstKey(obj5), 'Z');

  const obj6 = { z: 'value1', a: 'value2', b: 'value3' };
  assert.strictEqual(metautil.firstKey(obj6), 'z');
});

test('Object: isInstanceOf', () => {
  const date = new Date();
  assert.strictEqual(metautil.isInstanceOf(date, 'Date'), true);
  assert.strictEqual(metautil.isInstanceOf(date, 'Object'), false);

  const arr = [1, 2, 3];
  assert.strictEqual(metautil.isInstanceOf(arr, 'Array'), true);
  assert.strictEqual(metautil.isInstanceOf(arr, 'Object'), false);
  assert.strictEqual(metautil.isInstanceOf(arr, 'Date'), false);

  class TestClass {}
  const instance = new TestClass();
  assert.strictEqual(metautil.isInstanceOf(instance, 'TestClass'), true);
  assert.strictEqual(metautil.isInstanceOf(instance, 'Object'), false);

  const obj = { a: 1, b: 2 };
  assert.strictEqual(metautil.isInstanceOf(obj, 'Object'), true);
  assert.strictEqual(metautil.isInstanceOf(obj, 'Array'), false);

  assert.strictEqual(metautil.isInstanceOf(null, 'Object'), false);
  assert.strictEqual(metautil.isInstanceOf(null, 'Date'), false);

  assert.strictEqual(metautil.isInstanceOf(undefined, 'Object'), false);
  assert.strictEqual(metautil.isInstanceOf(undefined, 'Date'), false);

  assert.strictEqual(metautil.isInstanceOf(42, 'Number'), true);
  assert.strictEqual(metautil.isInstanceOf('hello', 'String'), true);
  assert.strictEqual(metautil.isInstanceOf(true, 'Boolean'), true);

  const fn = () => {};
  assert.strictEqual(metautil.isInstanceOf(fn, 'Function'), true);
  assert.strictEqual(metautil.isInstanceOf(fn, 'Object'), false);

  const regex = /test/;
  assert.strictEqual(metautil.isInstanceOf(regex, 'RegExp'), true);
  assert.strictEqual(metautil.isInstanceOf(regex, 'Object'), false);
});
