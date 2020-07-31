'use strict';

const metatests = require('metatests');
const common = require('..');

metatests.case(
  'Common / array',
  { common },
  {
    'common.splitAt': [
      [0, [1, 2, 3, 4, 5], [[], [1, 2, 3, 4, 5]]],
      [1, [1, 2, 3, 4, 5], [[1], [2, 3, 4, 5]]],
      [
        2,
        [1, 2, 3, 4, 5],
        [
          [1, 2],
          [3, 4, 5],
        ],
      ],
      [
        3,
        [1, 2, 3, 4, 5],
        [
          [1, 2, 3],
          [4, 5],
        ],
      ],
      [4, [1, 2, 3, 4, 5], [[1, 2, 3, 4], [5]]],
      [5, [1, 2, 3, 4, 5], [[1, 2, 3, 4, 5], []]],
    ],
    'common.last': [
      [[5], 5],
      [[1, 2, 3, 4, 5], 5],
      [[true, true, false], false],
      [[false, true, true], true],
      [[], undefined],
    ],
    'common.range': [
      [1, 5, [1, 2, 3, 4, 5]],
      [5, 1, []],
      [1, 0, []],
      [1, 1, [1]],
      [8, 9, [8, 9]],
    ],
    'common.sequence': [
      [
        [80, 81, 82],
        [80, 81, 82],
      ],
      [
        // eslint-disable-next-line no-sparse-arrays
        [40, , 45],
        [40, 41, 42, 43, 44, 45],
      ],
      [
        [40, [6]],
        [40, 41, 42, 43, 44, 45],
      ],
      [[40, [-3]], 6, [40, 41, 42]],
    ],
    'common.shuffle': [
      [[1, 2, 3], result => JSON.stringify(result.sort()) === '[1,2,3]'],
      [['a', 'b'], result => JSON.stringify(result.sort()) === '["a","b"]'],
      [[1, 'a', 3], result => JSON.stringify(result.sort()) === '[1,3,"a"]'],
      [[], result => JSON.stringify(result.sort()) === '[]'],
    ],
    'common.sample': [
      [[1, 2, 3], result => [1, 2, 3].includes(result)],
      [['a', 'b', 'c'], result => ['a', 'b', 'c'].includes(result)],
    ],
  }
);

metatests.test('array / pushSame', test => {
  const array = [1, 2, 3];
  test.strictSame(common.pushSame(array, 0, 1), 3);
  test.strictSame(array, [1, 2, 3]);
  test.strictSame(common.pushSame(array, 5, 0), 8);
  test.strictSame(array, [1, 2, 3, 0, 0, 0, 0, 0]);
  test.end();
});

metatests.test('array / shuffle uniform distribution', test => {
  const N = 1e7;
  const dist = {
    abc: 0,
    acb: 0,
    bac: 0,
    bca: 0,
    cab: 0,
    cba: 0,
  };
  for (let i = 0; i < N; i++) {
    const arr = ['a', 'b', 'c'];
    const key = common.shuffle(arr).join('');
    dist[key]++;
  }
  test.assert(
    Object.values(dist)
      .map(c => Math.round((c / N) * 100))
      .every((c, i, arr) => c === arr[0])
  );
  test.end();
});
