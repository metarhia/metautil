'use strict';

const tap = require('tap');
const common = require('..');

tap.test('isScalar', (test) => {
  test.assert(common.isScalar(0));
  test.assert(common.isScalar(''));
  test.assert(common.isScalar(true));
  test.assert(common.isScalar(undefined));
  test.assertNot(common.isScalar([]));
  test.assertNot(common.isScalar({}));
  test.end();
});

tap.test('copy', (test) => {
  const array = [1, 2, 3];
  const copy = common.copy(array);
  test.assertNot(array === copy);
  test.strictSame(array, copy);
  test.end();
});

tap.test('getByPath', (test) => {
  const obj = { a: { b: { c: 42 } } };
  test.strictSame(common.getByPath(obj, 'a.b.c'), 42);
  test.end();
});

tap.test('getByPath non-existent', (test) => {
  const obj = { a: { b: {} } };
  test.assertNot(common.getByPath(obj, 'a.b.c'));
  test.end();
});

tap.test('setByPath', (test) => {
  const obj = { a: {} };
  test.assert(common.setByPath(obj, 'a.b.c', 42));
  test.strictSame(obj.a.b.c, 42);
  test.end();
});

tap.test('setByPath non-object', (test) => {
  const obj = { a: 10 };
  test.assertNot(common.setByPath(obj, 'a.b.c', 42));
  test.end();
});

tap.test('setByPath non-object first', (test) => {
  const nonobj = 10;
  test.assertNot(common.setByPath(nonobj, 'a.b.c', 42));
  test.end();
});

tap.test('setByPath non-object last', (test) => {
  const obj = { a: { b: 10 } };
  test.assertNot(common.setByPath(obj, 'a.b.c', 42));
  test.end();
});

tap.test('deleteByPath', (test) => {
  const obj = { a: { b: { c: 42 } } };
  test.assert(common.deleteByPath(obj, 'a.b.c'));
  test.assertNot(obj.a.b.c);
  test.end();
});

tap.test('deleteByPath non-existent', (test) => {
  const obj = { a: {} };
  test.assertNot(common.deleteByPath(obj, 'a.b.c'));
  test.end();
});

tap.test('deleteByPath non-existent last', (test) => {
  const obj = { a: { b: {} } };
  test.assertNot(common.deleteByPath(obj, 'a.b.c'));
  test.end();
});

tap.test('merge', (test) => {
  const array1 = [1, 2, 3];
  const array2 = [3, 4, 5];
  test.strictSame(common.merge(array1, array2), [1, 2, 3, 4, 5]);
  test.end();
});
