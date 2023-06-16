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
    'metautil.random': [
      [0, 10, (result) => result >= 0 && result <= 10],
      [1, 10, (result) => result >= 1 && result <= 10],
      [-1, 10, (result) => result >= -1 && result <= 10],
      [10, 20, (result) => result >= 10 && result <= 20],
      [10, 0, (result) => result >= 0 && result <= 10],
      [20, (result) => result >= 0 && result <= 20],
      [10, 10, 10],
    ],
  },
);
