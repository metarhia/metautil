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
