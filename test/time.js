'use strict';

const tap = require('tap');
const common = require('..');

tap.test('isTimeEqual', (test) => {
  const t1 = new Date('December 17, 1995 03:24:00');
  const t2 = new Date('1995-12-17T03:24:00');
  test.assert(common.isTimeEqual(t1, t2));
  test.end();
});

tap.test('nowDate', (test) => {
  const date = new Date('1995-12-17T03:24:00Z');
  test.strictSame(common.nowDate(date), '1995-12-17');
  test.end();
});

tap.test('nowDateTime', (test) => {
  const date = new Date('1995-12-17T03:24:00Z');
  test.strictSame(common.nowDateTime(date), '1995-12-17 03:24');
  test.end();
});
