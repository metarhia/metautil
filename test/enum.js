'use strict';

const metatests = require('metatests');
const { Enum } = require('..');

metatests.test('Enum with key/value', test => {
  const Month = Enum.from({
    Jan: 'January',
    Feb: 'February',
    Mar: 'March',
    Apr: 'April',
    May: 'May',
    Jun: 'June',
    Jul: 'July',
    Aug: 'August',
    Sep: 'September',
    Oct: 'October',
    Nov: 'November',
    Dec: 'December',
  });

  test.strictSame(typeof Month, 'function');
  test.strictSame(typeof Month.values, 'object');
  test.strictSame(Array.isArray(Month.values), false);

  test.strictSame(Month.has('May'), true);
  test.strictSame(Month.key('Aug'), 7);

  const may = Month.from('May');
  test.strictSame(typeof may, 'object');
  test.strictSame(may.value, 'May');
  test.strictSame(may.index, 4);
  test.strictSame(may.data, 'May');

  test.strictSame(+may, 4);
  test.strictSame(may + '', '4');

  test.end();
});

metatests.test('Enum string month keys', test => {
  const Month = Enum.from(
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  );

  test.strictSame(typeof Month, 'function');
  test.strictSame(Array.isArray(Month.values), true);

  test.strictSame(Month.has('May'), true);
  test.strictSame(Month.has('Aug'), false);
  test.strictSame(Month.key('August'), 7);

  const may = Month.from('May');
  test.strictSame(typeof may, 'object');
  test.strictSame(Month.has('May'), true);
  test.strictSame(may.value, 'May');
  test.strictSame(may.index, 4);
  test.strictSame(may.data, undefined);

  test.strictSame(+may, 4);
  test.strictSame(may + '', '4');

  test.end();
});

metatests.test('Enum string month typed keys', test => {
  const Month = Enum.from({
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  });

  test.strictSame(typeof Month, 'function');
  test.strictSame(typeof Month.values, 'object');
  test.strictSame(Array.isArray(Month.values), false);

  test.strictSame(Month.has('5'), true);
  test.strictSame(Month.has(13), false);

  const may = Month.from('5');
  test.strictSame(typeof may, 'object');
  test.strictSame(may.value, '5');
  test.strictSame(may.index, 4);
  test.strictSame(may.data, 'May');

  test.strictSame(+may, 4);
  test.strictSame(may + '', '4');

  test.end();
});

metatests.test('Enum hundreds keys', test => {
  const Hundreds = Enum.from(100, 200, 300, 400, 500);

  const h100 = Hundreds.from(100);
  const h200 = Hundreds.from(200);
  const h500 = Hundreds.from(500);

  test.strictSame(Hundreds.from(-1), Enum.NaE);
  test.strictSame(Hundreds.from(0), Enum.NaE);
  test.strictSame(Hundreds.from(600), Enum.NaE);
  test.strictSame(Hundreds.from('Hello'), Enum.NaE);

  test.strictSame(typeof Hundreds, 'function');
  test.strictSame(Array.isArray(Hundreds.values), true);
  test.strictSame(Hundreds.values.length, 5);

  test.strictSame(h100.value, 100);
  test.strictSame(h100.index, 0);
  test.strictSame(h100.data, undefined);

  test.strictSame(+h100, 0);
  test.strictSame(h100 + '', '0');
  test.strictSame(h100.value, 100);

  test.strictSame(+h200, 1);
  test.strictSame(h200 + '', '1');
  test.strictSame(h200.value, 200);

  test.strictSame(+h500, 4);
  test.strictSame(h500 + '', '4');
  test.strictSame(h500.value, 500);

  test.end();
});

metatests.test('Enum hundreds keys array', test => {
  const Hundreds = Enum.from([100, 200, 300, 400, 500]);

  test.strictSame(Hundreds.from(0), Enum.NaE);

  const h100 = Hundreds.from(100);
  test.strictSame(h100.value, 100);
  test.strictSame(h100.index, 0);
  test.strictSame(h100.data, undefined);

  test.end();
});

metatests.test('Enum.NaE property', test => {
  test.strictSame(Object.getOwnPropertyDescriptor(Enum, 'NaE'), {
    writable: false,
    enumerable: false,
    configurable: false,
    value: Enum.NaE,
  });
  test.end();
});
