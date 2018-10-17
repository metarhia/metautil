'use strict';

const metatests = require('metatests');
const common = require('..');

metatests.case('Common / math', { common }, {
  'common.random': [
    [ 0, 10, result => result >=  0 && result <= 10],
    [ 1, 10, result => result >=  1 && result <= 10],
    [-1, 10, result => result >= -1 && result <= 10],
    [10, 20, result => result >= 10 && result <= 20],
    [10, 0,  result => result >=  0 && result <= 10],
    [20,     result => result >=  0 && result <= 20],
    [10, 10, 10],
  ],
  'common.cryptoRandom': [
    [result => result >= 0 && result <= 1],
  ],
});
