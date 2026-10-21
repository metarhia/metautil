'use strict';

const test = require('node:test');
const assert = require('node:assert');

const metatests = require('metatests');

const nodeMajorVersion = parseInt(process.version.slice(1).split('.')[0], 10);
if (nodeMajorVersion < 19) {
  test.skip('Browser tests require Node.js >= 19', () => {});
  process.exit(0);
}

const metautil = require('../lib/browser.js');

const testRandom = (random) => {
  assert.strictEqual(random(100, 100), 100);
  assert.strictEqual(random(-100, -100), -100);
  assert.strictEqual(random(0, 0), 0);
  for (let i = 0; i < 200; i++) {
    const fraction = random();
    assert(fraction >= 0 && fraction < 1);
    const upTo = random(100);
    assert(Number.isInteger(upTo) && upTo >= 0 && upTo <= 100);
    const between = random(100, 200);
    assert(Number.isInteger(between) && between >= 100 && between <= 200);
  }
};

test('Browser crypto: cryptoRandom', async () => {
  testRandom(metautil.cryptoRandom);
});

test('Browser crypto: random', async () => {
  testRandom(metautil.random);
});

const CHARS = 'ABCD';

metatests.case(
  'Browser crypto: identification utilities',
  { metautil },
  {
    'metautil.generateKey': [
      [CHARS, 5, (s) => s.split('').every((c) => CHARS.includes(c))],
      [CHARS, 5, (s) => s.length === 5],
      ['AAA', 5, 'AAAAA'],
      ['A', 5, 'AAAAA'],
      [CHARS, 0, ''],
      [CHARS, -1, ''],
    ],
  },
);
