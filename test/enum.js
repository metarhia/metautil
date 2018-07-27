'use strict';

const { Enum } = api.common;

api.metatests.test('Enum with key/value', (test) => {
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
    Dec: 'December'
  });

  test.strictSame(typeof(Month), 'function');
  test.strictSame(typeof(Month.collection), 'object');
  test.strictSame(Array.isArray(Month.collection), false);

  test.strictSame(Month.has('May'), true);
  test.strictSame(Month.key('August'), 'Aug');

  const may = new Month('May');
  test.strictSame(typeof(may), 'object');
  test.strictSame(Month.has('May'), true);
  test.strictSame(may.value, 'May');

  test.strictSame(+may, NaN);
  test.strictSame(may + '', 'May');

  test.end();
});

api.metatests.test('Enum string keys', (test) => {
  const Month = Enum.from(
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  );

  test.strictSame(typeof(Month), 'function');
  test.strictSame(typeof(Month.collection), 'object');
  test.strictSame(Array.isArray(Month.collection), false);

  test.strictSame(Month.has('May'), true);
  test.strictSame(Month.has('Aug'), false);
  test.strictSame(Month.key('August'), '7');

  const may = new Month('May');
  test.strictSame(typeof(may), 'object');
  test.strictSame(Month.has('May'), true);
  test.strictSame(may.value, '4');

  test.strictSame(+may, 4);
  test.strictSame(may + '', 'May');

  test.end();
});

api.metatests.test('Enum string keys', (test) => {
  const Month  = Enum.from({
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
    12: 'December'
  });

  test.strictSame(typeof(Month), 'function');
  test.strictSame(typeof(Month.collection), 'object');
  test.strictSame(Array.isArray(Month.collection), false);

  test.strictSame(Month.has('May'), true);
  test.strictSame(Month.has('Aug'), false);
  test.strictSame(Month.key('August'), '8');

  const may = new Month('May');
  test.strictSame(typeof(may), 'object');
  test.strictSame(Month.has('May'), true);
  test.strictSame(may.value, '5');

  test.strictSame(+may, 5);
  test.strictSame(may + '', 'May');

  test.end();
});

api.metatests.test('Enum string keys', (test) => {
  const Hundreds = Enum.from(100, 200, 300, 400, 500);

  const neg = new Hundreds(-1);
  const zero = new Hundreds(0);
  const h100 = new Hundreds(100);
  const h200 = new Hundreds(200);
  const h500 = new Hundreds(500);
  const h600 = new Hundreds(600);
  const unknown = new Hundreds('Hello');

  test.strictSame(typeof(Hundreds), 'function');
  test.strictSame(typeof(Hundreds.collection), 'object');
  test.strictSame(Array.isArray(Hundreds.collection), true);
  test.strictSame(Hundreds.collection.length, 5);

  test.strictSame(+neg, NaN);
  test.strictSame(neg + '', 'undefined');

  test.strictSame(+zero, NaN);
  test.strictSame(zero + '', 'undefined');

  test.strictSame(+h100, 100);
  test.strictSame(h100 + '', '100');

  test.strictSame(+h200, 200);
  test.strictSame(h200 + '', '200');

  test.strictSame(+h500, 500);
  test.strictSame(h500 + '', '500');

  test.strictSame(+h600, NaN);
  test.strictSame(h600 + '', 'undefined');

  test.strictSame(+unknown, NaN);
  test.strictSame(unknown + '', 'undefined');

  test.end();
});
