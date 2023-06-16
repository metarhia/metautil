'use strict';

const metatests = require('metatests');
const metautil = require('..');

metatests.case(
  'Date and time',
  { metautil },
  {
    'metautil.parseDay': [
      ['Sun', 1],
      ['Sunday', 1],
      ['', -1],
      ['Abc', -1],
    ],
    'metautil.parseMonth': [
      ['Apr', 4],
      ['April', 4],
      ['', -1],
      ['Abc', -1],
    ],
    'metautil.parseEvery': [
      ['', { YY: -1, MM: -1, DD: -1, wd: -1, hh: -1, mm: -1, ms: -1 }],
      ['3s', { YY: -1, MM: -1, DD: -1, wd: -1, hh: -1, mm: -1, ms: 3000 }],
      [':30', { YY: -1, MM: -1, DD: -1, wd: -1, hh: -1, mm: 30, ms: -1 }],
      ['17:', { YY: -1, MM: -1, DD: -1, wd: -1, hh: 17, mm: 0, ms: -1 }],
      ['Apr', { YY: -1, MM: 4, DD: -1, wd: -1, hh: -1, mm: -1, ms: -1 }],
      ['5th', { YY: -1, MM: -1, DD: 5, wd: -1, hh: -1, mm: -1, ms: -1 }],
      ['Sun', { YY: -1, MM: -1, DD: -1, wd: 1, hh: -1, mm: -1, ms: -1 }],
      ['2022', { YY: 2022, MM: -1, DD: -1, wd: -1, hh: -1, mm: -1, ms: -1 }],
      ['Apr 3s', { YY: -1, MM: 4, DD: -1, wd: -1, hh: -1, mm: -1, ms: 3000 }],
      ['5th 3s', { YY: -1, MM: -1, DD: 5, wd: -1, hh: -1, mm: -1, ms: 3000 }],
      ['Sun 3s', { YY: -1, MM: -1, DD: -1, wd: 1, hh: -1, mm: -1, ms: 3000 }],
      ['17:30', { YY: -1, MM: -1, DD: -1, wd: -1, hh: 17, mm: 30, ms: -1 }],
      ['1st :30', { YY: -1, MM: -1, DD: 1, wd: -1, hh: -1, mm: 30, ms: -1 }],
      ['2nd 17:', { YY: -1, MM: -1, DD: 2, wd: -1, hh: 17, mm: 0, ms: -1 }],
      ['Sun 4th', { YY: -1, MM: -1, DD: 4, wd: 1, hh: -1, mm: -1, ms: -1 }],
      ['Apr 3rd', { YY: -1, MM: 4, DD: 3, wd: -1, hh: -1, mm: -1, ms: -1 }],
      ['10th Apr', { YY: -1, MM: 4, DD: 10, wd: -1, hh: -1, mm: -1, ms: -1 }],
      ['2022 Apr', { YY: 2022, MM: 4, DD: -1, wd: -1, hh: -1, mm: -1, ms: -1 }],
      ['2022 5th', { YY: 2022, MM: -1, DD: 5, wd: -1, hh: -1, mm: -1, ms: -1 }],
      ['2022 Fri', { YY: 2022, MM: -1, DD: -1, wd: 6, hh: -1, mm: -1, ms: -1 }],
      [
        '2022 Aug Fri',
        { YY: 2022, MM: 8, DD: -1, wd: 6, hh: -1, mm: -1, ms: -1 },
      ],
      [
        '2022 Aug 5th',
        { YY: 2022, MM: 8, DD: 5, wd: -1, hh: -1, mm: -1, ms: -1 },
      ],
      [
        '2022 Aug Fri 21:',
        { YY: 2022, MM: 8, DD: -1, wd: 6, hh: 21, mm: 0, ms: -1 },
      ],
      [
        '2022 Aug Fri :60',
        { YY: 2022, MM: 8, DD: -1, wd: 6, hh: -1, mm: 60, ms: -1 },
      ],
      [
        '2022 15th 01:30 25s',
        { YY: 2022, MM: -1, DD: 15, wd: -1, hh: 1, mm: 30, ms: 25000 },
      ],
      [
        '5th Fri 01:30 5s',
        { YY: -1, MM: -1, DD: 5, wd: 6, hh: 1, mm: 30, ms: 5000 },
      ],
      [
        'Aug 1th Fri 01:30 5s',
        { YY: -1, MM: 8, DD: 1, wd: 6, hh: 1, mm: 30, ms: 5000 },
      ],
      [
        '2022 Aug 5th Fri',
        { YY: 2022, MM: 8, DD: 5, wd: 6, hh: -1, mm: -1, ms: -1 },
      ],
      [
        '2022 Aug 5th Fri 23:',
        { YY: 2022, MM: 8, DD: 5, wd: 6, hh: 23, mm: 0, ms: -1 },
      ],
      [
        '2022 Aug 5th Fri :30',
        { YY: 2022, MM: 8, DD: 5, wd: 6, hh: -1, mm: 30, ms: -1 },
      ],
      [
        '2022 Aug 5th Fri 23:30',
        { YY: 2022, MM: 8, DD: 5, wd: 6, hh: 23, mm: 30, ms: -1 },
      ],
      [
        '2022 Aug 5th Fri 23:30 15s',
        { YY: 2022, MM: 8, DD: 5, wd: 6, hh: 23, mm: 30, ms: 15000 },
      ],
    ],
    'metautil.nextEvent': [
      [
        { YY: -1, MM: -1, DD: -1, wd: -1, hh: -1, mm: -1, ms: -1 },
        new Date('Tue, 20 Jul 2021 12:00:00 GMT'),
        0,
      ],
      [
        { YY: 2022, MM: 8, DD: 1, wd: 2, hh: -1, mm: -1, ms: -1 },
        new Date('Mon, 01 Aug 2022 12:00:00 GMT'),
        0,
      ],
      [
        { YY: 2022, MM: 8, DD: 1, wd: 2, hh: 13, mm: -1, ms: -1 },
        new Date('Mon, 01 Aug 2022 12:00:00 GMT'),
        3600000,
      ],
      [
        { YY: 2022, MM: 8, DD: 2, wd: 3, hh: 22, mm: 30, ms: 8000 },
        new Date('Mon, 01 Aug 2022 12:00:00 GMT'),
        0,
      ],
      [
        { YY: -1, MM: 8, DD: 1, wd: -1, hh: -1, mm: -1, ms: -1 },
        new Date('Mon, 01 Aug 2022 12:00:00 GMT'),
        0,
      ],
      [
        { YY: 2023, MM: 1, DD: -1, wd: -1, hh: -1, mm: -1, ms: -1 },
        new Date('Mon, 01 Aug 2022 12:00:00 GMT'),
        0,
      ],
      [
        { YY: 2022, MM: 1, DD: -1, wd: -1, hh: -1, mm: -1, ms: -1 },
        new Date('Mon, 01 Aug 2022 12:00:00 GMT'),
        -1,
      ],
      [
        { YY: 2021, MM: 2, DD: 4, wd: 4, hh: 5, mm: 6, ms: 100 },
        new Date('Tue, 20 Jul 2021 12:00:00 GMT'),
        -1,
      ],
      [
        { YY: 2021, MM: 7, DD: -1, wd: -1, hh: -1, mm: -1, ms: 5000 },
        new Date('Tue, 20 Jul 2021 12:00:00 GMT'),
        5000,
      ],
      [
        { YY: 2021, MM: 7, DD: 20, wd: -1, hh: -1, mm: -1, ms: 5000 },
        new Date('Tue, 20 Jul 2021 12:00:00 GMT'),
        5000,
      ],
      [
        { YY: 2021, MM: 8, DD: 1, wd: -1, hh: -1, mm: -1, ms: 5000 },
        new Date('Tue, 20 Jul 2021 12:00:00 GMT'),
        0,
      ],
      [
        { YY: 2021, MM: 7, DD: 20, wd: 3, hh: -1, mm: -1, ms: 5000 },
        new Date('Tue, 20 Jul 2021 12:00:00 GMT'),
        5000,
      ],
      [
        { YY: 2021, MM: 7, DD: 20, wd: 3, hh: 15, mm: 30, ms: -1 },
        new Date('Tue, 20 Jul 2021 12:00:00 GMT'),
        12600000,
      ],
      [
        { YY: 2021, MM: 7, DD: 20, wd: 3, hh: -1, mm: -1, ms: 12600000 },
        new Date('Tue, 20 Jul 2021 12:00:00 GMT'),
        12600000,
      ],
      [
        { YY: 2021, MM: 7, DD: 20, wd: 3, hh: 11, mm: 30, ms: -1 },
        new Date('Tue, 20 Jul 2021 12:00:00 GMT'),
        -1,
      ],
      [
        { YY: 2021, MM: 7, DD: 20, wd: 3, hh: 13, mm: 30, ms: -1 },
        new Date('Tue, 20 Jul 2021 12:00:00 GMT'),
        5400000,
      ],
    ],
    'metautil.nowDateTimeUTC': [
      [undefined, (s) => s.length === 'YYYY-MM-DDThh:mm:ss'.length],
      [new Date('2021-10-15T20:54:18.713Z'), '2021-10-15T20:54:18'],
      [new Date('2020-12-01T01:15:30+03:00'), '2020-11-30T22:15:30'],
      [undefined, '-', (s) => s.length === 'YYYY-MM-DDThh:mm:ss'.length],
      [new Date('2021-10-15T20:54:18.713Z'), '-', '2021-10-15T20-54-18'],
      [new Date('2020-12-01T01:15:30+03:00'), '-', '2020-11-30T22-15-30'],
    ],
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
  },
);
