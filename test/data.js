'use strict';

/*eslint max-len: ["error", { "code": 120 }]*/

api.metatests.case('Common / data types', {
  'common.isScalar': [
    [0,          true],
    ['value1',   true],
    [50,         true],
    [true,       true],
    [false,      true],
    [null,      false],
    [undefined,  true],
    [NaN,        true],
    [Infinity,   true],
    [[],        false],
    [{},        false],
    ['',         true],
  ],
  'common.copy': [
    [[1, 2, 3],         [1, 2, 3]],
    [[],                       []],
    [[true, false], [true, false]],
  ],
  'common.getByPath': [
    [{ item: { subitem: { value: 'Gagarin' } } }, 'item.subitem.value',            'Gagarin'],
    [{ item: { subitem: { value: 123       } } }, 'item.subitem.value',                  123],
    [{ item: { subitem: { value: true      } } }, 'item.subitem.value',                 true],
    [{ item: { subitem: { value: false     } } }, 'item.subitem.value',                false],
    [{ item: { subitem: { value: 'Gagarin' } } }, 'item.subitem.none',             undefined],
    [{ item: { subitem: { value: null      } } }, 'item.subitem.value',                 null],
    [{ item: { subitem: { value: 'Gagarin' } } }, 'item.none.value',               undefined],
    [{ item: { subitem: { value: 'Gagarin' } } }, 'item.subitem',       { value: 'Gagarin' }],
  ],
  'common.setByPath': [
    [{ item: { subitem: { value: 'Gagarin' } } }, 'item.subitem.value', 'Gagarin',             true],
    [{ item: { subitem: { value: 'Gagarin' } } }, 'item.subitem.none',  'Gagarin',             true],
    [{ item: { subitem: { value: 123       } } }, 'item.subitem.value', 123,                   true],
    [{ item: { subitem: { value: true      } } }, 'item.subitem.value', true,                  true],
    [{ item: { subitem: { value: false     } } }, 'item.subitem.value', false,                 true],
    [{ item: { subitem: { value: 'Gagarin' } } }, 'item.subitem.none',  undefined,             true],
    [{ item: { subitem: { value: null      } } }, 'item.subitem.value', null,                  true],
    [{ item: { subitem: { value: 'Gagarin' } } }, 'item.none.value',    undefined,             true],
    [{ item: { subitem: { value: 'Gagarin' } } }, 'none.value',         123,                   true],
    [{ item: { subitem: { value: 'Gagarin' } } }, 'item.subitem',       { value: 'Gagarin' },  true],
  ],
  'common.deleteByPath': [
    [{ item: { surname: 'Gagarin', name: 'Yuri' } }, 'item.name',    true],
    [{ item: { surname: 'Gagarin', name: 'Yuri' } }, 'item.noname', false],
    [{ item: { surname: 'Gagarin', name: 'Yuri' } }, 'item',         true],
    [{ item: { surname: 'Gagarin', name: 'Yuri' } }, 'unknown',     false],
  ],
  'common.merge': [
    [['a', 'b'], ['a', 'c'],       ['a', 'b', 'c']],
    [['a', 'b'], ['a', 'b'],            ['a', 'b']],
    [['b', 'c'], ['a', 'b'],       ['b', 'c', 'a']],
    [['a', 'b'], ['c', 'd'],  ['a', 'b', 'c', 'd']],
    [[1, 2, 3],  [1, 2, 3],              [1, 2, 3]],
    [[1, 2, 3],  [4, 5, 1],        [1, 2, 3, 4, 5]],
  ],
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
