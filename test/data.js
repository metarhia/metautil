'use strict';

api.metatests.case('Common / data types', {
  'common.isScalar': [
    [0,         true ],
    ['value1',  true ],
    [50,        true ],
    [true,      true ],
    [false,     true ],
    [null,      false],
    [undefined, true ],
    [NaN,       true ],
    [Infinity,  true ],
    [[],        false],
    [{},        false],
    ['',        true ],
  ]
});

api.metatests.test('copy', (test) => {
  const array = [1, 2, 3];
  const copy = api.common.copy(array);
  test.assertNot(array === copy);
  test.strictSame(array, copy);
  test.end();
});

api.metatests.test('getByPath', (test) => {
  const obj = { a: { b: { c: 42 } } };
  test.strictSame(api.common.getByPath(obj, 'a.b.c'), 42);
  test.end();
});

api.metatests.test('getByPath non-existent', (test) => {
  const obj = { a: { b: {} } };
  test.assertNot(api.common.getByPath(obj, 'a.b.c'));
  test.end();
});

api.metatests.test('setByPath', (test) => {
  const obj = { a: {} };
  test.assert(api.common.setByPath(obj, 'a.b.c', 42));
  test.strictSame(obj.a.b.c, 42);
  test.end();
});

api.metatests.test('setByPath non-object', (test) => {
  const obj = { a: 10 };
  test.assertNot(api.common.setByPath(obj, 'a.b.c', 42));
  test.end();
});

api.metatests.test('setByPath non-object first', (test) => {
  const nonobj = 10;
  test.assertNot(api.common.setByPath(nonobj, 'a.b.c', 42));
  test.end();
});

api.metatests.test('setByPath non-object last', (test) => {
  const obj = { a: { b: 10 } };
  test.assertNot(api.common.setByPath(obj, 'a.b.c', 42));
  test.end();
});

api.metatests.test('deleteByPath', (test) => {
  const obj = { a: { b: { c: 42 } } };
  test.assert(api.common.deleteByPath(obj, 'a.b.c'));
  test.assertNot(obj.a.b.c);
  test.end();
});

api.metatests.test('deleteByPath non-existent', (test) => {
  const obj = { a: {} };
  test.assertNot(api.common.deleteByPath(obj, 'a.b.c'));
  test.end();
});

api.metatests.test('deleteByPath non-existent last', (test) => {
  const obj = { a: { b: {} } };
  test.assertNot(api.common.deleteByPath(obj, 'a.b.c'));
  test.end();
});

api.metatests.test('merge', (test) => {
  const array1 = [1, 2, 3];
  const array2 = [3, 4, 5];
  test.strictSame(api.common.merge(array1, array2), [1, 2, 3, 4, 5]);
  test.end();
});
