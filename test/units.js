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
    'metautil.parseEvery': [
      ['', { month: -1, day: -1, dd: -1, hh: -1, mm: -1, interval: 0 }],
      [':30', { month: -1, day: -1, dd: -1, hh: -1, mm: 30, interval: 0 }],
      ['17:', { month: -1, day: -1, dd: -1, hh: 17, mm: 0, interval: 0 }],
      ['17:30', { month: -1, day: -1, dd: -1, hh: 17, mm: 30, interval: 0 }],
      ['1st :30', { month: -1, day: -1, dd: 1, hh: -1, mm: 30, interval: 0 }],
      ['2nd 17:', { month: -1, day: -1, dd: 2, hh: 17, mm: 0, interval: 0 }],
      ['Apr 3rd', { month: 3, day: -1, dd: 3, hh: -1, mm: -1, interval: 0 }],
      ['Sun 4th', { month: -1, day: 0, dd: 4, hh: -1, mm: -1, interval: 0 }],
      [
        'Sun 3s',
        { month: -1, day: -1, dd: -1, hh: -1, mm: -1, interval: 3000 },
      ],
    ],
  }
);
