'use strict';

const metatests = require('metatests');
const metautil = require('..');
const path = require('path');

metatests.case(
  'String functions',
  { metautil },
  {
    'metautil.split': [
      ['abc.def', '.', ['abc', 'def']],
      ['abc.', '.', ['abc', '']],
      ['abc', '.', ['abc', '']],
      ['.abc', '.', ['', 'abc']],
      ['.', '.', ['', '']],
      ['', '.', ['', '']],
      ['abc', '', ['', 'abc']],
    ],
    'metautil.parseParams': [
      ['a=1&b=2', { a: '1', b: '2' }],
      ['a=1b=2', { a: '1b=2' }],
      ['a=1', { a: '1' }],
      ['a=1&', { a: '1' }],
      ['a=', { a: '' }],
      ['a', { a: '' }],
    ],
    'metautil.replace': [
      ['a2a2a2', 'a2', 'z', 'zzz'],
      ['k2k2k2', 'a2', 'z', 'k2k2k2'],
      ['', 'a2', 'z', ''],
      ['a2', '', 'z', 'a2'],
      ['a2', 'a2', '', ''],
      ['a2', 'a2', 'a2', 'a2'],
      ['a2a2a2', 'a2', 'a2', 'a2a2a2'],
      ['a20w10z2a22aa0', 'a2', '', '0w10z22aa0'],
    ],
    'metautil.fileExt': [
      ['/dir/dir/file.txt', 'txt'],
      ['/dir/dir/file.txt', 'txt'],
      ['\\dir\\file.txt', 'txt'],
      ['/dir/dir/file.txt', 'txt'],
      ['/dir/file.txt', 'txt'],
      ['/dir/file.TXt', 'txt'],
      ['//file.txt', 'txt'],
      ['file.txt', 'txt'],
      ['/dir.ext/', 'ext'],
      ['/dir/', ''],
      ['/', ''],
      ['.', ''],
      ['', ''],
    ],
    'metautil.parsePath': [
      ['', ['']],
      ['file', ['file']],
      ['file.js', ['file']],
      [`example${path.sep}stop`, ['example', 'stop']],
      [`example${path.sep}stop.js`, ['example', 'stop']],
      [`example${path.sep}sub2${path.sep}do.js`, ['example', 'sub2', 'do']],
    ],
    'metautil.between': [
      ['abcdefghijk', 'cd', 'h', 'efg'],
      ['field="value"', '"', '"', 'value'],
      ['field:"value"', '"', '"', 'value'],
      ['field[value]', '[', ']', 'value'],
      ['kjihgfedcba', 'cd', 'h', ''],
      ['kjihgfedcba', 'dc', 'h', ''],
      ['field="value"', '=', '=', ''],
      ['field[value]', '{', '}', ''],
      ['{a:"b",c:"d"}', '"', '"', 'b'],
      ['abcdefghijk', 'cd', 'efghijk'],
    ],
    'metautil.isFirstUpper': [
      ['Abcd', true],
      ['abcd', false],
      ['aBCD', false],
      ['', false],
      ['?string', false],
    ],
    'metautil.isFirstLower': [
      ['Abcd', false],
      ['abcd', true],
      ['aBCD', true],
      ['', false],
      ['?string', false],
    ],
    'metautil.isFirstLetter': [
      ['Abcd', true],
      ['abcd', true],
      ['', false],
      ['?string', false],
    ],
    'metautil.toLowerCamel': [
      ['Abcd', 'abcd'],
      ['abcd', 'abcd'],
      ['aBCD', 'aBCD'],
      ['AbCd', 'abCd'],
      ['aBcD', 'aBcD'],
      ['', ''],
    ],
    'metautil.toUpperCamel': [
      ['Abcd', 'Abcd'],
      ['abcd', 'Abcd'],
      ['aBCD', 'ABCD'],
      ['AbCd', 'AbCd'],
      ['aBcD', 'ABcD'],
      ['', ''],
    ],
    'metautil.toLower': [
      ['abcd', 'abcd'],
      ['ABCD', 'abcd'],
      ['', ''],
    ],
    'metautil.toCamel': [
      ['-', (f) => f('ab-cd') === 'abCd'],
      ['--', (f) => f('AB--CD') === 'abCd'],
      ['', (f) => f('') === ''],
    ],
    'metautil.spinalToCamel': [
      ['abcd', 'abcd'],
      ['ab-cd', 'abCd'],
      ['AB-CD', 'abCd'],
      ['AB-CD', 'abCd'],
      ['a', 'a'],
      ['', ''],
      ['-', ''],
    ],
    'metautil.snakeToCamel': [
      ['abcd', 'abcd'],
      ['ab_cd', 'abCd'],
      ['AB_CD', 'abCd'],
      ['AB_CD', 'abCd'],
      ['a', 'a'],
      ['', ''],
      ['_', ''],
    ],
    'metautil.isConstant': [
      ['UPPER', true],
      ['UPPER_SNAKE', true],
      ['lowercase', false],
      ['camelCase', false],
      ['PascalCase', false],
      ['snake_case', false],
    ],
    'metautil.parseCookies': [
      ['a=1;b=2', { a: '1', b: '2' }],
      ['a=1 ;b= 2', { a: '1', b: '2' }],
      ['a=1; b = 2 ', { a: '1', b: '2' }],
      ['a=1', { a: '1' }],
    ],
  },
);

metatests.case(
  'Array functions',
  { metautil },
  {
    'metautil.sample': [
      [[1, 2, 3], (result) => [1, 2, 3].includes(result)],
      [['a', 'b', 'c'], (result) => ['a', 'b', 'c'].includes(result)],
    ],
  },
);

metatests.case(
  'Math functions',
  { metautil },
  {
    'metautil.random': [
      [0, 10, (result) => result >= 0 && result <= 10],
      [1, 10, (result) => result >= 1 && result <= 10],
      [-1, 10, (result) => result >= -1 && result <= 10],
      [10, 20, (result) => result >= 10 && result <= 20],
      [10, 0, (result) => result >= 0 && result <= 10],
      [20, (result) => result >= 0 && result <= 20],
      [10, 10, 10],
    ],
    'metautil.cryptoRandom': [[(result) => result >= 0 && result <= 1]],
  },
);

metatests.case(
  'Units utilities',
  { metautil },
  {
    'metautil.duration': [
      ['1d', 86400000],
      ['2d', 172800000],
      ['10h', 36000000],
      ['7m', 420000],
      ['13s', 13000],
      ['2d 43s', 172843000],
      ['5d 17h 52m 1s', 496321000],
      ['1d 10h 7m 13s', 122833000],
      ['1s', 1000],
      [500, 500],
      [0, 0],
      ['', 0],
      ['15', 0],
      ['10q', 0],
      [null, 0],
      [undefined, 0],
    ],
    'metautil.bytesToSize': [
      [0, '0'],
      [1, '1'],
      [100, '100'],
      [999, '999'],
      [1000, '1 KB'],
      [1023, '1 KB'],
      [1024, '1 KB'],
      [1025, '1 KB'],
      [1111, '1 KB'],
      [2222, '2 KB'],
      [10000, '10 KB'],
      [1000000, '1 MB'],
      [100000000, '100 MB'],
      [10000000000, '10 GB'],
      [1000000000000, '1 TB'],
      [100000000000000, '100 TB'],
      [10000000000000000, '10 PB'],
      [1000000000000000000, '1 EB'],
      [100000000000000000000, '100 EB'],
      [10000000000000000000000, '10 ZB'],
      [1000000000000000000000000, '1 YB'],
    ],
    'metautil.sizeToBytes': [
      ['', NaN],
      ['0', 0],
      ['1', 1],
      ['512', 512],
      ['100', 100],
      ['999', 999],
      ['1 kB', 1000],
      ['2 Kb', 2000],
      ['10 kb', 10000],
      ['1 MB', 1000000],
      ['100 MB', 100000000],
      ['10 GB', 10000000000],
      ['1 TB', 1000000000000],
      ['100 TB', 100000000000000],
      ['10 PB', 10000000000000000],
      ['1 EB', 1000000000000000000],
      ['100 EB', 100000000000000000000],
      ['10 ZB', 10000000000000000000000],
      ['1 YB', 1000000000000000000000000],
    ],
    'metautil.parseDay': [
      ['Sun', 1],
      ['Sunday', 1],
      ['', -1],
      ['Abc', -1],
    ],
    'metautil.parseMonth': [
      ['Apr', 4],
      ['April', 4],
      ['', -1],
      ['Abc', -1],
    ],
    'metautil.parseEvery': [
      ['', { MM: -1, DD: -1, wd: -1, hh: -1, mm: -1, ms: -1 }],
      ['3s', { MM: -1, DD: -1, wd: -1, hh: -1, mm: -1, ms: 3000 }],
      [':30', { MM: -1, DD: -1, wd: -1, hh: -1, mm: 30, ms: -1 }],
      ['17:', { MM: -1, DD: -1, wd: -1, hh: 17, mm: 0, ms: -1 }],
      ['Apr', { MM: 4, DD: -1, wd: -1, hh: -1, mm: -1, ms: -1 }],
      ['5th', { MM: -1, DD: 5, wd: -1, hh: -1, mm: -1, ms: -1 }],
      ['Sun', { MM: -1, DD: -1, wd: 1, hh: -1, mm: -1, ms: -1 }],
      ['Apr 3s', { MM: 4, DD: -1, wd: -1, hh: -1, mm: -1, ms: 3000 }],
      ['5th 3s', { MM: -1, DD: 5, wd: -1, hh: -1, mm: -1, ms: 3000 }],
      ['Sun 3s', { MM: -1, DD: -1, wd: 1, hh: -1, mm: -1, ms: 3000 }],
      ['17:30', { MM: -1, DD: -1, wd: -1, hh: 17, mm: 30, ms: -1 }],
      ['1st :30', { MM: -1, DD: 1, wd: -1, hh: -1, mm: 30, ms: -1 }],
      ['2nd 17:', { MM: -1, DD: 2, wd: -1, hh: 17, mm: 0, ms: -1 }],
      ['Sun 4th', { MM: -1, DD: 4, wd: 1, hh: -1, mm: -1, ms: -1 }],
      ['Apr 3rd', { MM: 4, DD: 3, wd: -1, hh: -1, mm: -1, ms: -1 }],
    ],
    'metautil.nextEvent': [
      [
        { MM: -1, DD: -1, wd: -1, hh: -1, mm: -1, ms: -1 },
        new Date('Tue, 20 Jul 2021 12:00:00 GMT'),
        -1,
      ],
      [
        { MM: 2, DD: 4, wd: 4, hh: 5, mm: 6, ms: 100 },
        new Date('Tue, 20 Jul 2021 12:00:00 GMT'),
        -1,
      ],
      [
        { MM: 7, DD: -1, wd: -1, hh: -1, mm: -1, ms: 5000 },
        new Date('Tue, 20 Jul 2021 12:00:00 GMT'),
        5000,
      ],
      [
        { MM: 7, DD: 20, wd: -1, hh: -1, mm: -1, ms: 5000 },
        new Date('Tue, 20 Jul 2021 12:00:00 GMT'),
        5000,
      ],
      [
        { MM: 7, DD: 20, wd: 3, hh: -1, mm: -1, ms: 5000 },
        new Date('Tue, 20 Jul 2021 12:00:00 GMT'),
        5000,
      ],
      [
        { MM: 7, DD: 20, wd: 3, hh: 15, mm: 30, ms: -1 },
        new Date('Tue, 20 Jul 2021 12:00:00 GMT'),
        12600000,
      ],
      [
        { MM: 7, DD: 20, wd: 3, hh: -1, mm: -1, ms: 12600000 },
        new Date('Tue, 20 Jul 2021 12:00:00 GMT'),
        12600000,
      ],
      [
        { MM: 7, DD: 20, wd: 3, hh: 11, mm: 30, ms: -1 },
        new Date('Tue, 20 Jul 2021 12:00:00 GMT'),
        -1,
      ],
      [
        { MM: 7, DD: 20, wd: 3, hh: 13, mm: 30, ms: -1 },
        new Date('Tue, 20 Jul 2021 12:00:00 GMT'),
        5400000,
      ],
    ],
    'metautil.nowDateTimeUTC': [
      [undefined, (s) => s.length === 'YYYY-MM-DDThh:mm:ss'.length],
      [new Date('2021-10-15T20:54:18.713Z'), '2021-10-15T20:54:18'],
      [new Date('2020-12-01T01:15:30+03:00'), '2020-11-30T22:15:30'],
      [undefined, '-', (s) => s.length === 'YYYY-MM-DDThh:mm:ss'.length],
      [new Date('2021-10-15T20:54:18.713Z'), '-', '2021-10-15T20-54-18'],
      [new Date('2020-12-01T01:15:30+03:00'), '-', '2020-11-30T22-15-30'],
    ],
  },
);

metatests.case(
  'Network utilities',
  { metautil },
  {
    'metautil.ipToInt': [
      ['127.0.0.1', 2130706433],
      ['10.0.0.1', 167772161],
      ['192.168.1.10', -1062731510],
      ['165.225.133.150', -1511946858],
      ['0.0.0.0', 0],
      ['wrong-string', Number.NaN],
      ['', 0],
      ['8.8.8.8', 0x08080808],
      [undefined, 0x7f000001],
    ],
    'metautil.parseHost': [
      ['', 'no-host-name-in-http-headers'],
      ['domain.com', 'domain.com'],
      ['localhost', 'localhost'],
      ['domain.com:8080', 'domain.com'],
      ['localhost:8080', 'localhost'],
    ],
    'metautil.jsonParse': [
      ['{}', {}],
      ['{ "a": 5 }', { a: 5 }],
      ['{', null],
      ['', null],
    ],
  },
);

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
