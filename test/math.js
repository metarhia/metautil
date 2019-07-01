'use strict';

const metatests = require('metatests');
const common = require('..');

metatests.case(
  'Common / math',
  { common },
  {
    'common.random': [
      [0, 10, result => result >= 0 && result <= 10],
      [1, 10, result => result >= 1 && result <= 10],
      [-1, 10, result => result >= -1 && result <= 10],
      [10, 20, result => result >= 10 && result <= 20],
      [10, 0, result => result >= 0 && result <= 10],
      [20, result => result >= 0 && result <= 20],
      [10, 10, 10],
    ],
    'common.cryptoRandom': [[result => result >= 0 && result <= 1]],
  }
);

metatests.test('cryptoPrefetcher with invalid arguments', test => {
  test.throws(
    () => common.cryptoPrefetcher(10, 8),
    new RangeError('buffer size must be a multiple of value size')
  );
  test.end();
});

metatests.test('cryptoPrefetcher', test => {
  const valueSize = 4;
  const prefetcher = common.cryptoPrefetcher(valueSize * 5, valueSize);
  for (let i = 0; i < 10; i++) {
    const buf = prefetcher.next();
    test.assert(Buffer.isBuffer(buf));
    test.strictSame(buf.length, valueSize);
  }
  test.end();
});
