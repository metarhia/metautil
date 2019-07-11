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

metatests.testSync('cryptoPrefetcher for of', test => {
  const valueSize = 8;
  const cryptoPrefetcher = common.cryptoPrefetcher(valueSize * 5, valueSize);
  let i = 0;
  for (const buf of cryptoPrefetcher) {
    test.assert(Buffer.isBuffer(buf));
    test.strictSame(buf.length, valueSize);
    if (++i === 10) break;
  }
  test.strictSame(i, 10);
});

metatests.testSync(
  'cryptoPrefetcher [Symbol.iterator] must be iterator',
  test => {
    const valueSize = 8;
    const cryptoPrefetcher = common.cryptoPrefetcher(valueSize * 5, valueSize);
    const it = cryptoPrefetcher[Symbol.iterator]();
    let i = 0;
    for (const buf of it) {
      test.assert(Buffer.isBuffer(buf));
      test.strictSame(buf.length, valueSize);
      if (++i === 10) break;
    }
    test.strictSame(i, 10);
  }
);

metatests.testSync('cryptoPrefetcher for of wrapped', test => {
  const valueSize = 8;
  const cryptoPrefetcher = common.cryptoPrefetcher(valueSize * 5, valueSize);
  let i = 0;
  for (const buf of common.iter(cryptoPrefetcher).take(10)) {
    i++;
    test.assert(Buffer.isBuffer(buf));
    test.strictSame(buf.length, valueSize);
  }
  test.strictSame(i, 10);
});
