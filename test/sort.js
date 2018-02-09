'use strict';

const tap = require('tap');
const common = require('..');

tap.test('sortComparePriority', (test) => {
  const priorities = ['c', 'a', 'b'];
  const array = ['0', 'a', 'b', 'c', '0'];
  const sorted = ['c', 'a', 'b', '0', '0'];
  const result = array.sort(common.sortComparePriority.bind(null, priorities));
  test.strictSame(result, sorted);
  test.end();
});

tap.test('sortCompareDirectories', (test) => {
  const array = [
    { name: 'file0.txt' },
    { name: '/dir' },
    { name: 'file1.txt' },
    { name: 'file0.txt' },
    { name: '/foo' }
  ];
  const sorted = [
    { name: '/dir' },
    { name: '/foo' },
    { name: 'file0.txt' },
    { name: 'file0.txt' },
    { name: 'file1.txt' },
  ];
  test.strictSame(array.sort(common.sortCompareDirectories), sorted);
  test.end();
});

tap.test('sortCompareByName', (test) => {
  const array = [{ name: 'c' }, { name: 'a' }, { name: 'a' }, { name: 'b' }];
  const sorted = [{ name: 'a' }, { name: 'a' }, { name: 'b' }, { name: 'c' }];
  test.strictSame(array.sort(common.sortCompareByName), sorted);
  test.end();
});

