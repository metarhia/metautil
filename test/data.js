'use strict';

/*eslint max-len: ["error", { "code": 120 }]*/

const metatests = require('metatests');
const common = require('..');

metatests.case(
  'Common / data types',
  { common },
  {
    'common.isScalar': [
      [0, true],
      ['value1', true],
      [50, true],
      [true, true],
      [false, true],
      [null, false],
      [undefined, true],
      [NaN, true],
      [Infinity, true],
      [[], false],
      [{}, false],
      ['', true],
    ],
    'common.copy': [
      [
        [1, 2, 3],
        [1, 2, 3],
      ],
      [[], []],
      [
        [true, false],
        [true, false],
      ],
    ],
    'common.clone': [
      [{}, {}],
      [{ a: [1, 2, 3] }, { a: [1, 2, 3] }],
      [
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
      ],
      [{ a: { b: 2, c: 3 } }, { a: { b: 2, c: 3 } }],
      [{ a: new Date('2000-01-01') }, { a: {} }],
      [
        Object.assign(Object.create(null), { a: 1, b: 2, c: 3 }),
        { a: 1, b: 2, c: 3 },
      ],
    ],
    'common.duplicate': [
      [{}, {}],
      [{ a: [1, 2, 3] }, { a: [1, 2, 3] }],
      [
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
      ],
      [{ a: { b: 2, c: 3 } }, { a: { b: 2, c: 3 } }],
      [{ a: new Date('2000-01-01') }, { a: new Date('2000-01-01') }],
    ],
    'common.getByPath': [
      [
        { item: { subitem: { value: 'Gagarin' } } },
        'item.subitem.value',
        'Gagarin',
      ],
      [{ item: { subitem: { value: 123 } } }, 'item.subitem.value', 123],
      [{ item: { subitem: { value: true } } }, 'item.subitem.value', true],
      [{ item: { subitem: { value: false } } }, 'item.subitem.value', false],
      [
        { item: { subitem: { value: 'Gagarin' } } },
        'item.subitem.none',
        undefined,
      ],
      [{ item: { subitem: { value: null } } }, 'item.subitem.value', null],
      [
        { item: { subitem: { value: 'Gagarin' } } },
        'item.none.value',
        undefined,
      ],
      [
        { item: { subitem: { value: 'Gagarin' } } },
        'item.subitem',
        { value: 'Gagarin' },
      ],
    ],
    'common.setByPath': [
      [
        { item: { subitem: { value: 'Gagarin' } } },
        'item.subitem.value',
        'Gagarin',
        true,
      ],
      [
        { item: { subitem: { value: 'Gagarin' } } },
        'item.subitem.none',
        'Gagarin',
        true,
      ],
      [{ item: { subitem: { value: 123 } } }, 'item.subitem.value', 123, true],
      [
        { item: { subitem: { value: true } } },
        'item.subitem.value',
        true,
        true,
      ],
      [
        { item: { subitem: { value: false } } },
        'item.subitem.value',
        false,
        true,
      ],
      [
        { item: { subitem: { value: 'Gagarin' } } },
        'item.subitem.none',
        undefined,
        true,
      ],
      [
        { item: { subitem: { value: null } } },
        'item.subitem.value',
        null,
        true,
      ],
      [
        { item: { subitem: { value: 'Gagarin' } } },
        'item.none.value',
        undefined,
        true,
      ],
      [{ item: { subitem: { value: 'Gagarin' } } }, 'none.value', 123, true],
      [
        { item: { subitem: { value: 'Gagarin' } } },
        'item.subitem',
        { value: 'Gagarin' },
        true,
      ],
    ],
    'common.deleteByPath': [
      [{ item: { surname: 'Gagarin', name: 'Yuri' } }, 'item.name', true],
      [{ item: { surname: 'Gagarin', name: 'Yuri' } }, 'item.noname', false],
      [{ item: { surname: 'Gagarin', name: 'Yuri' } }, 'item', true],
      [{ item: { surname: 'Gagarin', name: 'Yuri' } }, 'unknown', false],
      [
        Object.assign(Object.create(null), {
          item: { surname: 'Gagarin', name: 'Yuri' },
        }),
        'item',
        true,
      ],
    ],
    'common.merge': [
      [
        ['a', 'b'],
        ['a', 'c'],
        ['a', 'b', 'c'],
      ],
      [
        ['a', 'b'],
        ['a', 'b'],
        ['a', 'b'],
      ],
      [
        ['b', 'c'],
        ['a', 'b'],
        ['b', 'c', 'a'],
      ],
      [
        ['a', 'b'],
        ['c', 'd'],
        ['a', 'b', 'c', 'd'],
      ],
      [
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
      ],
      [
        [1, 2, 3],
        [4, 5, 1],
        [1, 2, 3, 4, 5],
      ],
    ],
    'common.mergeObjects': [
      [
        (_, a, b) => a + b,
        { a: 'a', b: 'b' },
        { a: 'a', b: 'c' },
        { a: 'aa', b: 'bc' },
      ],
      [(_, a, b) => a || b, { a: 'a' }, { d: 'd', a: 'c' }, { a: 'a', d: 'd' }],
      [
        (_, a, b) => (a || 0) + (b || 0),
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2 },
        { a: 2, b: 4, c: 3 },
      ],
      [key => key, Object.assign(Object.create(null), { 1: 'a' }), { 1: '1' }],
    ],
  }
);

metatests.test('setByPath', test => {
  const obj = { a: {} };
  test.assert(common.setByPath(obj, 'a.b.c', 42));
  test.strictSame(obj.a.b.c, 42);
  test.end();
});

metatests.test('setByPath non-object', test => {
  const obj = { a: 10 };
  test.assertNot(common.setByPath(obj, 'a.b.c', 42));
  test.end();
});

metatests.test('setByPath non-object first', test => {
  const nonobj = 10;
  test.assertNot(common.setByPath(nonobj, 'a.b.c', 42));
  test.end();
});

metatests.test('setByPath non-object last', test => {
  const obj = { a: { b: 10 } };
  test.assertNot(common.setByPath(obj, 'a.b.c', 42));
  test.end();
});

metatests.test('deleteByPath', test => {
  const obj = { a: { b: { c: 42 } } };
  test.assert(common.deleteByPath(obj, 'a.b.c'));
  test.assertNot(obj.a.b.c);
  test.end();
});

metatests.test('deleteByPath non-existent', test => {
  const obj = { a: {} };
  test.assertNot(common.deleteByPath(obj, 'a.b.c'));
  test.end();
});

metatests.test('deleteByPath non-existent last', test => {
  const obj = { a: { b: {} } };
  test.assertNot(common.deleteByPath(obj, 'a.b.c'));
  test.end();
});

metatests.test('duplicate correctly handling object prototypes', test => {
  const objects = [{}, new Date(), Object.create(null)];
  objects.forEach(obj => {
    const res = common.duplicate(obj);
    test.strictSame(res.constructor, obj.constructor);
  });
  test.end();
});

metatests.test('duplicate handling only object own properties', test => {
  const buf = Buffer.from('test data');
  const res = common.duplicate(buf);
  test.strictSame(res, buf);
  test.end();
});

metatests.test('duplicate correctly handles circular references', test => {
  const obj = { a: {} };
  obj.a.obj = obj;
  const res = common.duplicate(obj);
  test.sameTopology(res, obj);
  test.end();
});

metatests.test('clone handling only object own properties', test => {
  const buf = Buffer.from('test data');
  const res = common.clone(buf);
  test.strictSame(res, buf);
  test.end();
});

metatests.testSync('mergeObjects correctly handles ownProperties', test => {
  const bufs = [Buffer.from([1, 2, 3]), Buffer.from([4, 5, 6])];
  const actual = common.mergeObjects((_, a, b) => a + b, ...bufs);
  test.strictSame(actual, Buffer.from([5, 7, 9]));
});

metatests.testSync('mergeObjects passes correct arguments to merger', test => {
  const objs = [{ a: 13 }, { a: 42 }, { a: 99 }];
  const actual = common.mergeObjects(
    test.mustCall((key, ...args) => {
      test.strictSame(key, 'a');
      test.strictSame(args, [13, 42, 99]);
      return Math.max(...args);
    }),
    ...objs
  );
  test.strictSame(actual, { a: 99 });
});
