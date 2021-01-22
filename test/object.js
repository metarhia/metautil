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
