'use strict';

const metatests = require('metatests');
const common = require('..');

metatests.case(
  'Common / array',
  { common },
  {
    'common.sample': [
      [[1, 2, 3], (result) => [1, 2, 3].includes(result)],
      [['a', 'b', 'c'], (result) => ['a', 'b', 'c'].includes(result)],
    ],
  }
);
