'use strict';

const metatests = require('metatests');
const metautil = require('..');

metatests.case(
  'Array functions',
  { metautil },
  {
    'metautil.sample': [
      [[1, 2, 3], (result) => [1, 2, 3].includes(result)],
      [['a', 'b', 'c'], (result) => ['a', 'b', 'c'].includes(result)],
    ],
  }
);
