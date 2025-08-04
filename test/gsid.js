'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { generateGSID } = require('../lib/gsid.js');

const DIGITS = '0123456789';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CHARS = DIGITS + LOWER + UPPER + '-_';

test('GSID generation produces valid format', () => {
  const gsid = generateGSID();
  assert.strictEqual(typeof gsid, 'string');
  assert.strictEqual(gsid.length, 24);
});

test('GSID uses only characters from the character table', () => {
  const gsid = generateGSID();
  for (let i = 0; i < gsid.length; i++) {
    assert.strictEqual(CHARS.includes(gsid[i]), true);
  }
});

test('GSID generation of custom length', () => {
  const gsid10 = generateGSID(10);
  const gsid12 = generateGSID(12);
  const gsid16 = generateGSID(16);
  const gsid18 = generateGSID(18);
  const gsid20 = generateGSID(20);
  const gsid24 = generateGSID(24);
  const gsid32 = generateGSID(32);

  assert.strictEqual(gsid10.length, 10);
  assert.strictEqual(gsid12.length, 12);
  assert.strictEqual(gsid16.length, 16);
  assert.strictEqual(gsid18.length, 18);
  assert.strictEqual(gsid20.length, 20);
  assert.strictEqual(gsid24.length, 24);
  assert.strictEqual(gsid32.length, 32);
});

test('Performance: generate 10 mln GSIDs', () => {
  const count = 1_000_000;
  const startTime = process.hrtime.bigint();

  const gsids = [];
  for (let i = 0; i < count; i++) {
    gsids.push(generateGSID());
  }

  const endTime = process.hrtime.bigint();
  const duration = Number(endTime - startTime) / 1_000_000;

  assert.strictEqual(gsids.length, count);
  assert.strictEqual(duration < 1000, true);

  console.log(`Generated ${count} GSIDs in ${duration.toFixed(2)}ms`);
  console.log(`Rate: ${(count / (duration / 1000)).toFixed(0)} GSIDs/second`);
});
