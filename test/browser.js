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
  {
    const value = random(100, 100);
    assert.strictEqual(typeof value, 'number');
    assert.strictEqual(value, 100);
  }
  {
    const value = random(-100, -100);
    assert.strictEqual(typeof value, 'number');
    assert.strictEqual(value, -100);
  }
  {
    const value = random(0, 0);
    assert.strictEqual(typeof value, 'number');
    assert.strictEqual(value, 0);
  }
  for (let i = 0; i < 200; i++) {
    const value = random();
    assert.strictEqual(typeof value, 'number');
    assert(value >= 0);
    assert(value <= 1);
  }
  for (let i = 0; i < 200; i++) {
    const value = random(100);
    assert.strictEqual(typeof value, 'number');
    assert(value >= 0);
    assert(value <= 100);
  }
  for (let i = 0; i < 200; i++) {
    const value = random(100, 200);
    assert.strictEqual(typeof value, 'number');
    assert(value >= 100);
    assert(value <= 200);
  }
};

test('Browser crypto: cryptoRandom', async () => {
  testRandom(metautil.cryptoRandom);
});

test('Browser crypto: cryptoRandom', async () => {
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
