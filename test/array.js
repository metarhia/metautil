'use strict';

const metatests = require('metatests');
const common = require('..');

metatests.case('Common / array', { common }, {
  'common.splitAt': [
    [0, [1, 2, 3, 4, 5],   [[], [1, 2, 3, 4, 5]]],
    [1, [1, 2, 3, 4, 5],     [[1], [2, 3, 4, 5]]],
    [2, [1, 2, 3, 4, 5],     [[1, 2], [3, 4, 5]]],
    [3, [1, 2, 3, 4, 5],     [[1, 2, 3], [4, 5]]],
    [4, [1, 2, 3, 4, 5],     [[1, 2, 3, 4], [5]]],
    [5, [1, 2, 3, 4, 5],   [[1, 2, 3, 4, 5], []]],
  ],
  'common.last': [
    [[5],                       5],
    [[1, 2, 3, 4, 5],           5],
    [[true, true, false],   false],
    [[false, true, true],    true],
    [[],                undefined],
  ],
  'common.range': [
    [1, 5,    [1, 2, 3, 4, 5]],
    [5, 1,                 []],
    [1, 0,                 []],
    [1, 1,                [1]],
    [8, 9,             [8, 9]],
  ],
  'common.sequence': [
    [[80, 81, 82],                 [80, 81, 82]],
    // eslint-disable-next-line no-sparse-arrays
    [[40,, 45],        [40, 41, 42, 43, 44, 45]],
    [[40, [6]],        [40, 41, 42, 43, 44, 45]],
    [[40, [-3]], 6,                [40, 41, 42]],
  ],
  'common.shuffle': [
    [[1, 2, 3],   result => JSON.stringify(result.sort()) === '[1,2,3]'  ],
    [['a', 'b'],  result => JSON.stringify(result.sort()) === '["a","b"]'],
    [[1, 'a', 3], result => JSON.stringify(result.sort()) === '[1,3,"a"]'],
    [[],          result => JSON.stringify(result.sort()) === '[]'       ],
  ],
});
