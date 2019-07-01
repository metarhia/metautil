'use strict';

const metatests = require('metatests');
const common = require('..');

const DefaultDate = Date;
const dateNowValue = 1561975200000; // 2019-07-01T10:00:00.000Z
// eslint-disable-next-line no-global-assign
Date = function(...args) {
  if (!new.target) {
    return DefaultDate.apply(DefaultDate, args);
  }
  if (args.length !== 0) {
    return new DefaultDate(...args);
  }
  return new DefaultDate(dateNowValue);
};
Date.now = function now() {
  return dateNowValue;
};

metatests.case(
  'Common / date & time',
  { common },
  {
    'common.isTimeEqual': [
      ['2014-01-01', '2014-01-01', true],
      ['2014-01-01', '2014-01-02', false],
      ['1234-12-12', '1234-12-12', true],
      ['1234-12-12', '4321-12-21', false],
      ['December 17, 1995 03:24:00', '1995-12-17T03:24:00', true],
    ],
    'common.nowDate': [
      [new Date('2014-12-12 12:30:15.150'), '2014-12-12'],
      [new Date('2014-12-12 12:30:15'), '2014-12-12'],
      [new Date('2014-12-12 12:30'), '2014-12-12'],
      [new Date('2014-12-12'), '2014-12-12'],
      [new Date('1995-12-17T03:24:00Z'), '1995-12-17'],
      ['2019-07-01'],
    ],
    'common.nowDateTime': [
      [new Date('2014-12-12 12:30:15.150Z'), '2014-12-12 12:30'],
      [new Date('2014-12-12 12:30:15Z'), '2014-12-12 12:30'],
      [new Date('2014-12-12 12:30Z'), '2014-12-12 12:30'],
      [new Date('2014-12-12Z'), '2014-12-12 00:00'],
      [new Date('1995-12-17T03:24:00Z'), '1995-12-17 03:24'],
      ['2019-07-01 10:00'],
    ],
  }
);
