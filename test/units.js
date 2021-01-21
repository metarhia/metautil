'use strict';

const metatests = require('metatests');
const metautil = require('..');

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
  }
);
