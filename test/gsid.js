'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { generateId } = require('../lib/gsid.js');

const DIGITS = '0123456789';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CHARS = DIGITS + LOWER + UPPER + '-_';

test('GSID generation produces valid format', () => {
  const gsid = generateId();
  assert.strictEqual(typeof gsid, 'string');
  assert.strictEqual(gsid.length, 24);
});

test('GSID uses only characters from the character table', () => {
  const gsid = generateId();
  for (let i = 0; i < gsid.length; i++) {
    assert.strictEqual(CHARS.includes(gsid[i]), true);
  }
});

test('GSID generation of custom length', () => {
  const gsid10 = generateId({ length: 10 });
  const gsid12 = generateId({ length: 12 });
  const gsid16 = generateId({ length: 16 });
  const gsid18 = generateId({ length: 18 });
  const gsid20 = generateId({ length: 20 });
  const gsid24 = generateId({ length: 24 });
  const gsid32 = generateId({ length: 32 });

  assert.strictEqual(gsid10.length, 10);
  assert.strictEqual(gsid12.length, 12);
  assert.strictEqual(gsid16.length, 16);
  assert.strictEqual(gsid18.length, 18);
  assert.strictEqual(gsid20.length, 20);
  assert.strictEqual(gsid24.length, 24);
  assert.strictEqual(gsid32.length, 32);
});

test('GSID edge case lengths', () => {
  const gsid1 = generateId({ length: 1 });
  const gsid256 = generateId({ length: 256 });

  assert.strictEqual(gsid1.length, 1);
  assert.strictEqual(gsid256.length, 256);
  assert.strictEqual(CHARS.includes(gsid1[0]), true);
  assert.strictEqual(CHARS.includes(gsid256[0]), true);
  assert.strictEqual(CHARS.includes(gsid256[255]), true);
});

test('GSID error handling for invalid lengths', () => {
  assert.throws(() => generateId({ length: 0 }), {
    name: 'Error',
    message: 'Incorrect GSID length 0 (expected 1..256)',
  });

  assert.throws(() => generateId({ length: -1 }), {
    name: 'Error',
    message: 'Incorrect GSID length -1 (expected 1..256)',
  });

  assert.throws(() => generateId({ length: 257 }), {
    name: 'Error',
    message: 'Incorrect GSID length 257 (expected 1..256)',
  });

  assert.throws(() => generateId({ length: 1000 }), {
    name: 'Error',
    message: 'Incorrect GSID length 1000 (expected 1..256)',
  });
});

test('GSID uniqueness for large batches', () => {
  const count = 10000;
  const gsids = new Set();

  for (let i = 0; i < count; i++) {
    const gsid = generateId();
    assert.strictEqual(gsids.has(gsid), false, `Duplicate GSID found: ${gsid}`);
    gsids.add(gsid);
  }

  assert.strictEqual(gsids.size, count);
});

test('GSID uniqueness for different lengths', () => {
  const lengths = [10, 24, 50, 100, 256];
  const allGsids = new Set();

  for (const length of lengths) {
    const gsids = new Set();
    for (let i = 0; i < 1000; i++) {
      const gsid = generateId({ length });
      assert.strictEqual(
        gsids.has(gsid),
        false,
        `Duplicate GSID of length ${length} found: ${gsid}`,
      );
      assert.strictEqual(
        allGsids.has(gsid),
        false,
        `Cross-length duplicate GSID found: ${gsid}`,
      );
      gsids.add(gsid);
      allGsids.add(gsid);
    }
    assert.strictEqual(gsids.size, 1000);
  }
});

test('GSID uniqueness for length 1 (limited uniqueness expected)', () => {
  const gsids = new Set();
  const count = 1000;

  for (let i = 0; i < count; i++) {
    gsids.add(generateId({ length: 1 }));
  }

  assert.strictEqual(
    gsids.size > 50,
    true,
    `Expected more than 50 unique single-character GSIDs, got ${gsids.size}`,
  );
  assert.strictEqual(
    gsids.size <= 64,
    true,
    `Expected at most 64 unique single-character GSIDs, got ${gsids.size}`,
  );
});

test('GSID character distribution', () => {
  const count = 10000;
  const length = 24;
  const charCounts = {};

  for (const char of CHARS) {
    charCounts[char] = 0;
  }

  for (let i = 0; i < count; i++) {
    const gsid = generateId({ length });
    for (const char of gsid) {
      charCounts[char]++;
    }
  }

  const totalChars = count * length;
  const expectedMin = (totalChars / CHARS.length) * 0.1;

  for (const char of CHARS) {
    assert.strictEqual(
      charCounts[char] > 0,
      true,
      `Character '${char}' not found in ${count} GSIDs`,
    );
    assert.strictEqual(
      charCounts[char] >= expectedMin,
      true,
      `Character '${char}' appears too rarely: ${charCounts[char]} times ` +
        `(expected at least ${expectedMin})`,
    );
  }
});

test('GSID buffer reuse mechanism', () => {
  const length = 16;
  const gsids = [];

  for (let i = 0; i < 1000; i++) {
    gsids.push(generateId({ length }));
  }

  const uniqueGsids = new Set(gsids);
  assert.strictEqual(uniqueGsids.size, 1000);

  for (const gsid of gsids) {
    assert.strictEqual(gsid.length, length);
    for (const char of gsid) {
      assert.strictEqual(CHARS.includes(char), true);
    }
  }
});

test('GSID mixed length generation', () => {
  const lengths = [1, 5, 10, 15, 20, 24, 30, 50, 100, 200, 256];
  const gsids = [];

  for (const length of lengths) {
    for (let i = 0; i < 100; i++) {
      gsids.push(generateId({ length }));
    }
  }

  const uniqueGsids = new Set(gsids);
  const expectedUnique = 64 + (lengths.length - 1) * 100;
  assert.strictEqual(
    uniqueGsids.size >= expectedUnique * 0.95,
    true,
    `Expected at least ${Math.floor(expectedUnique * 0.95)} unique GSIDs, ` +
      `got ${uniqueGsids.size}`,
  );

  let index = 0;
  for (const length of lengths) {
    for (let i = 0; i < 100; i++) {
      assert.strictEqual(gsids[index].length, length);
      index++;
    }
  }
});

test('Performance: generate 1 million GSIDs', () => {
  const count = 1_000_000;
  const startTime = process.hrtime.bigint();

  const gsids = [];
  for (let i = 0; i < count; i++) {
    gsids.push(generateId());
  }

  const endTime = process.hrtime.bigint();
  const duration = Number(endTime - startTime) / 1_000_000;

  assert.strictEqual(gsids.length, count);
  assert.strictEqual(duration < 1000, true);

  console.log(`Generated ${count} GSIDs in ${duration.toFixed(2)}ms`);
  console.log(`Rate: ${(count / (duration / 1000)).toFixed(0)} GSIDs/second`);
});

test('Performance: generate GSIDs of various lengths', () => {
  const lengths = [1, 10, 24, 50, 100, 256];
  const countPerLength = 100_000;
  const startTime = process.hrtime.bigint();

  for (const length of lengths) {
    for (let i = 0; i < countPerLength; i++) {
      generateId({ length });
    }
  }

  const endTime = process.hrtime.bigint();
  const duration = Number(endTime - startTime) / 1_000_000;
  const totalCount = lengths.length * countPerLength;

  assert.strictEqual(duration < 2000, true);

  console.log(
    `Generated ${totalCount} GSIDs of various lengths in ${duration.toFixed(
      2,
    )}ms`,
  );
  console.log(
    `Rate: ${(totalCount / (duration / 1000)).toFixed(0)} GSIDs/second`,
  );
});
