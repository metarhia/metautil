'use strict';

const metatests = require('metatests');
const metautil = require('..');

metatests.case(
  'Random',
  { metautil },
  {
    'metautil.sample': [
      [[1, 2, 3], (result) => [1, 2, 3].includes(result)],
      [['a', 'b', 'c'], (result) => ['a', 'b', 'c'].includes(result)],
    ],
    'metautil.shuffle': [
      [[1, 2, 3], (result) => JSON.stringify(result.sort()) === '[1,2,3]'],
      [['a', 'b'], (result) => JSON.stringify(result.sort()) === '["a","b"]'],
      [[1, 'a', 3], (result) => JSON.stringify(result.sort()) === '[1,3,"a"]'],
      [[], (result) => JSON.stringify(result.sort()) === '[]'],
      [
        [1, 2, 3],
        Math.random,
        (result) => JSON.stringify(result.sort()) === '[1,2,3]',
      ],
      [
        ['a', 'b'],
        Math.random,
        (result) => JSON.stringify(result.sort()) === '["a","b"]',
      ],
      [
        [1, 'a', 3],
        Math.random,
        (result) => JSON.stringify(result.sort()) === '[1,3,"a"]',
      ],
      [[], Math.random, (result) => JSON.stringify(result.sort()) === '[]'],

      [
        [1, 2, 3],
        metautil.cryptoRandom,
        (result) => JSON.stringify(result.sort()) === '[1,2,3]',
      ],
      [
        ['a', 'b'],
        metautil.cryptoRandom,
        (result) => JSON.stringify(result.sort()) === '["a","b"]',
      ],
      [
        [1, 'a', 3],
        metautil.cryptoRandom,
        (result) => JSON.stringify(result.sort()) === '[1,3,"a"]',
      ],
      [
        [],
        metautil.cryptoRandom,
        (result) => JSON.stringify(result.sort()) === '[]',
      ],
    ],
  },
);
