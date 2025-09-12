'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const nodeGSID = require('../lib/gsid.js');

const DIGITS = '0123456789';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const CHARS = '-' + DIGITS + UPPER + '_' + LOWER;

const run = (generateId, type = 'node') => {
  test('GSID generation produces valid format ' + type, () => {
    const gsid = generateId();
    assert.strictEqual(typeof gsid, 'string');
    assert.strictEqual(gsid.length, 24);
  });

  test('GSID uses only characters from the character table ' + type, () => {
    const gsid = generateId();
    for (let i = 0; i < gsid.length; i++) {
      assert.strictEqual(CHARS.includes(gsid[i]), true);
    }
  });

  test('GSID generation of custom length ' + type, () => {
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

  test('GSID edge case lengths ' + type, () => {
    const gsid1 = generateId({ length: 1 });
    const gsid256 = generateId({ length: 256 });

    assert.strictEqual(gsid1.length, 1);
    assert.strictEqual(gsid256.length, 256);
    assert.strictEqual(CHARS.includes(gsid1[0]), true);
    assert.strictEqual(CHARS.includes(gsid256[0]), true);
    assert.strictEqual(CHARS.includes(gsid256[255]), true);
  });

  test('GSID error handling for invalid lengths ' + type, () => {
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

  test('GSID time-based generation ' + type, () => {
    const gsid1 = generateId({ time: true });
    const gsid2 = generateId({ time: true, length: 32 });

    assert.strictEqual(typeof gsid1, 'string');
    assert.strictEqual(gsid1.length, 24);
    assert.strictEqual(gsid2.length, 32);

    for (const char of gsid1) {
      assert.strictEqual(CHARS.includes(char), true);
    }

    for (const char of gsid2) {
      assert.strictEqual(CHARS.includes(char), true);
    }
  });

  test('GSID time-based generation sortability ' + type, () => {
    const gsids = [];
    for (let i = 0; i < 100; i++) {
      gsids.push(generateId({ time: true }));
    }

    const sortedGsids = [...gsids].sort();
    assert.strictEqual(sortedGsids.length, gsids.length);

    // Verify that sorted array is actually sorted
    for (let i = 1; i < sortedGsids.length; i++) {
      assert.strictEqual(sortedGsids[i - 1] <= sortedGsids[i], true);
    }

    const gsids2 = [];
    for (let i = 0; i < 100; i++) {
      gsids2.push(generateId({ time: true, length: 32 }));
    }

    const sortedGsids2 = [...gsids2].sort();
    assert.strictEqual(sortedGsids2.length, gsids2.length);

    // Verify that sorted array is actually sorted
    for (let i = 1; i < sortedGsids2.length; i++) {
      assert.strictEqual(sortedGsids2[i - 1] <= sortedGsids2[i], true);
    }
  });

  test('GSID time-based generation error handling ' + type, () => {
    assert.throws(() => generateId({ time: true, length: 1 }), {
      name: 'Error',
      message: 'Incorrect GSID length 1 (for time=true (minimum 9)',
    });

    assert.throws(() => generateId({ time: true, length: 5 }), {
      name: 'Error',
      message: 'Incorrect GSID length 5 (for time=true (minimum 9)',
    });
  });

  test('GSID timestamp encoding verification ' + type, () => {
    // Tuesday, February 22, 2022 2:22:22.00 PM GMT-05:00
    const testTimestamp = 1645557742000;
    const expectedHex = '0x017F22E279B0';

    // Create a mock Date.now function
    const originalDateNow = Date.now;
    Date.now = () => testTimestamp;

    try {
      const gsid = generateId({ time: true, length: 24 });

      // Extract the timestamp part (first 8 characters)
      const timestampPart = gsid.substring(0, 8);

      console.log(`Expected timestamp: ${testTimestamp} (${expectedHex})`);
      console.log(`GSID: ${gsid}`);
      console.log(`Timestamp part: ${timestampPart}`);

      // Verify that the timestamp part is consistent when generated multiple
      // times
      const gsid2 = generateId({ time: true, length: 24 });
      const timestampPart2 = gsid2.substring(0, 8);

      assert.strictEqual(
        timestampPart,
        timestampPart2,
        'Timestamp parts should be identical for same timestamp',
      );

      // Verify the timestamp part is 8 characters long
      assert.strictEqual(timestampPart.length, 8);

      // Verify all characters are from the valid character set
      for (const char of timestampPart) {
        assert.strictEqual(
          CHARS.includes(char),
          true,
          `Character '${char}' not in valid character set`,
        );
      }

      // Decode the timestamp back to verify it's lossless
      let decodeTimestamp48;
      if (type === 'node') {
        ({ decodeTimestamp48 } = require('../lib/gsid.js'));
      } else {
        // For web version, we'll need to import it dynamically
        // This test will only work for node version
        return;
      }
      const decodedTimestamp = decodeTimestamp48(timestampPart);

      console.log(`Decoded timestamp: ${decodedTimestamp}`);
      assert.strictEqual(
        decodedTimestamp,
        testTimestamp,
        'Timestamp should be losslessly encoded and decoded',
      );
    } finally {
      // Restore original Date.now
      Date.now = originalDateNow;
    }
  });

  test('GSID uniqueness for large batches ' + type, () => {
    const count = 10000;
    const gsids = new Set();

    for (let i = 0; i < count; i++) {
      const gsid = generateId();
      assert.strictEqual(
        gsids.has(gsid),
        false,
        `Duplicate GSID found: ${gsid}`,
      );
      gsids.add(gsid);
    }

    assert.strictEqual(gsids.size, count);
  });

  test('GSID uniqueness for different lengths ' + type, () => {
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

  test('GSID uniqueness for length 1 (limited) ' + type, () => {
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

  test('GSID character distribution ' + type, () => {
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

  test('GSID buffer reuse mechanism ' + type, () => {
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

  test('GSID mixed length generation ' + type, () => {
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

  test('Performance: generate 1 million GSIDs ' + type, () => {
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

  test('Performance: generate GSIDs of various lengths ' + type, () => {
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

  test('encodeTimestamp48 function ' + type, async () => {
    let encodeTimestamp48;
    if (type === 'node') {
      ({ encodeTimestamp48 } = require('../lib/gsid.js'));
    } else {
      const webModule = await import('../web/gsid.mjs');
      ({ encodeTimestamp48 } = webModule);
    }
    let target;
    if (type === 'node') {
      target = Buffer.allocUnsafe(8);
    } else {
      target = new Uint8Array(8);
    }

    // Test with a known timestamp
    const testTimestamp = 1645557742000;
    encodeTimestamp48(testTimestamp, target);

    // Verify the encoded result
    const encoded =
      type === 'node'
        ? target.toString('ascii')
        : new TextDecoder().decode(target);
    assert.strictEqual(
      encoded.length,
      8,
      'Encoded timestamp should be 8 characters',
    );

    // Verify all characters are from the valid character set
    for (const char of encoded) {
      assert.strictEqual(
        CHARS.includes(char),
        true,
        `Character '${char}' not in valid character set`,
      );
    }

    // Test with current timestamp
    const currentTimestamp = Date.now();
    encodeTimestamp48(currentTimestamp, target);
    const currentEncoded =
      type === 'node'
        ? target.toString('ascii')
        : new TextDecoder().decode(target);
    assert.strictEqual(
      currentEncoded.length,
      8,
      'Current timestamp should encode to 8 characters',
    );
  });

  test('decodeTimestamp48 function ' + type, async () => {
    let decodeTimestamp48, encodeTimestamp48;
    if (type === 'node') {
      ({ decodeTimestamp48, encodeTimestamp48 } = require('../lib/gsid.js'));
    } else {
      const webModule = await import('../web/gsid.mjs');
      ({ decodeTimestamp48, encodeTimestamp48 } = webModule);
    }

    // Test with a known encoded timestamp
    // Tuesday, February 22, 2022 2:22:22.00 PM GMT-05:00
    const testTimestamp = 1645557742000;
    let testGSID;
    if (type === 'node') {
      const target = Buffer.allocUnsafe(8);
      encodeTimestamp48(testTimestamp, target);
      // Encoded timestamp + random part
      testGSID = target.toString('ascii') + 'RANDOM';
    } else {
      const target = new Uint8Array(8);
      encodeTimestamp48(testTimestamp, target);
      // Encoded timestamp + random part
      testGSID = new TextDecoder().decode(target) + 'RANDOM';
    }
    const decoded = decodeTimestamp48(testGSID);

    assert.strictEqual(
      decoded,
      testTimestamp,
      'Should decode to the original timestamp',
    );

    // Test with current timestamp
    const currentGSID = generateId({ time: true, length: 24 });
    const currentDecoded = decodeTimestamp48(currentGSID);
    const currentTime = Date.now();

    // Allow for small timing differences (within 100ms)
    const timeDiff = Math.abs(currentTime - currentDecoded);
    assert.strictEqual(
      timeDiff < 100,
      true,
      `Decoded timestamp should be close to current time (diff: ${timeDiff}ms)`,
    );
  });

  test('encode/decode timestamp48 round-trip ' + type, async () => {
    let encodeTimestamp48, decodeTimestamp48;
    if (type === 'node') {
      ({ encodeTimestamp48, decodeTimestamp48 } = require('../lib/gsid.js'));
    } else {
      const webModule = await import('../web/gsid.mjs');
      ({ encodeTimestamp48, decodeTimestamp48 } = webModule);
    }
    let target;
    if (type === 'node') {
      target = Buffer.allocUnsafe(8);
    } else {
      target = new Uint8Array(8);
    }

    // Test multiple timestamps
    const testTimestamps = [
      1645557742000, // Known test timestamp
      Date.now(), // Current timestamp
      1000000000000, // Early timestamp
      2000000000000, // Future timestamp
      0, // Epoch start
    ];

    for (const timestamp of testTimestamps) {
      // Encode
      encodeTimestamp48(timestamp, target);
      const encoded =
        type === 'node'
          ? target.toString('ascii')
          : new TextDecoder().decode(target);

      // Decode
      const decoded = decodeTimestamp48(encoded);

      // Verify round-trip
      assert.strictEqual(
        decoded,
        timestamp,
        `Round-trip failed for timestamp ${timestamp}`,
      );
    }
  });

  test('decodeTimestamp48 with invalid input ' + type, async () => {
    let decodeTimestamp48;
    if (type === 'node') {
      ({ decodeTimestamp48 } = require('../lib/gsid.js'));
    } else {
      const webModule = await import('../web/gsid.mjs');
      ({ decodeTimestamp48 } = webModule);
    }

    // Test with too short GSID
    assert.throws(
      () => decodeTimestamp48('ABC'),
      Error,
      'Should throw error for GSID shorter than 8 characters',
    );

    // Test with invalid characters
    assert.throws(
      () => decodeTimestamp48('INVALID!'),
      Error,
      'Should throw error for GSID with invalid characters',
    );
  });
};

run(nodeGSID.generateId, 'node');

if (global.crypto) {
  import('../web/gsid.mjs')
    .then((webGSID) => {
      run(webGSID.generateId, 'web');
    })
    .catch((err) => {
      console.error('Failed to import web GSID module:', err);
      process.exit(1);
    });
}
