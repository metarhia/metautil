'use strict';

const metatests = require('metatests');
const common = require('..');

metatests.test('Uint64 binary operators', test => {
  [
    {
      values: [0, 0],
      operations: {
        add: '0',
        sub: '0',
        mult: '0',
        cmp: 0,
        and: '0',
        or: '0',
        xor: '0',
      },
    },
    {
      values: [0, 1],
      operations: {
        add: '1',
        sub: 'ffffffffffffffff',
        mult: '0',
        div: '0',
        mod: '0',
        cmp: -1,
        and: '0',
        or: '1',
        xor: '1',
      },
    },
    {
      values: [1, 1],
      operations: {
        add: '2',
        sub: '0',
        mult: '1',
        div: '1',
        mod: '0',
        cmp: 0,
        and: '1',
        or: '1',
        xor: '0',
      },
    },
    {
      values: [0x3ff, 0x2],
      operations: {
        add: '401',
        sub: '3fd',
        mult: '7fe',
        div: '1ff',
        mod: '1',
        cmp: 1,
        and: '2',
        or: '3ff',
        xor: '3fd',
      },
    },
    {
      values: [0xffffffff, 0xffffffff],
      operations: {
        add: '1fffffffe',
        sub: '0',
        mult: 'fffffffe00000001',
        div: '1',
        mod: '0',
        cmp: 0,
        and: 'ffffffff',
        or: 'ffffffff',
        xor: '0',
      },
    },
    {
      values: [0x1fffffffffffff, 0xff],
      operations: {
        add: '200000000000fe',
        sub: '1fffffffffff00',
        mult: '1fdfffffffffff01',
        div: '202020202020',
        mod: '1f',
        cmp: 1,
        and: 'ff',
        or: '1fffffffffffff',
        xor: '1fffffffffff00',
      },
    },
    {
      values: [
        '0b0000000000000000000000000000000000000000000000000000000000000010',
        '0b0100000000000000000000000000000000000000000000000000000000000000',
      ],
      operations: {
        add: '4000000000000002',
        mult: '8000000000000000',
        cmp: -1,
        and: '0',
        or: '4000000000000002',
        xor: '4000000000000002',
      },
    },
    {
      values: [
        '0b0000000000000000000000000000000000000000000000000000000000000001',
        '0b1000000000000000000000000000000000000000000000000000000000000000',
      ],
      operations: {
        add: '8000000000000001',
        mult: '8000000000000000',
        cmp: -1,
        and: '0',
        or: '8000000000000001',
        xor: '8000000000000001',
      },
    },
    {
      values: [
        '0b1000000000000000000000000000000000000000000000000000000000000000',
        '0b0000000000000000000000000000000000000000000000000000000000000001',
      ],
      operations: {
        add: '8000000000000001',
        mult: '8000000000000000',
        cmp: 1,
        and: '0',
        or: '8000000000000001',
        xor: '8000000000000001',
      },
    },
  ].forEach(testcase => {
    Object.keys(testcase.operations).forEach(op => {
      const a = new common.Uint64(testcase.values[0]);
      const b = new common.Uint64(testcase.values[1]);
      if (common.Uint64[op]) {
        const result = common.Uint64[op](a, b);
        test.strictSame(
          op === 'cmp' ? result : result.toString(16),
          testcase.operations[op],
          `must successfully perform binary static operation ${op}` +
            ` on numbers ${testcase.values[0].toString(16)} and` +
            ` ${testcase.values[1].toString(16)}`
        );
      }
      if (a[op]) {
        a[op](b);
        test.strictSame(
          a.toString(16),
          testcase.operations[op],
          `must successfully perform binary non-static operation ${op}` +
            ` on numbers ${testcase.values[0].toString(16)} and` +
            ` ${testcase.values[1].toString(16)}`
        );
      }
    });
  });

  test.end();
});

metatests.test('Uint64 binary operators with numbers', test => {
  [
    {
      values: [0, 0],
      operations: {
        shiftLeft: '0',
        shiftRight: '0',
      },
    },
    {
      values: [0, 1],
      operations: {
        shiftLeft: '0',
        shiftRight: '0',
      },
    },
    {
      values: [1, 1],
      operations: {
        shiftLeft: '2',
        shiftRight: '0',
      },
    },
    {
      values: [1, 0],
      operations: {
        shiftLeft: '1',
        shiftRight: '1',
      },
    },
    {
      values: [1, 32],
      operations: {
        shiftLeft: '100000000',
        shiftRight: '0',
      },
    },
    {
      values: [1, 31],
      operations: {
        shiftLeft: '80000000',
        shiftRight: '0',
      },
    },
    {
      values: [0x80000000, 31],
      operations: {
        shiftLeft: '4000000000000000',
        shiftRight: '1',
      },
    },
    {
      values: ['0x4000000000000000', 2],
      operations: {
        shiftLeft: '0',
        shiftRight: '1000000000000000',
      },
    },
    {
      values: ['0x4000000000000000', 1],
      operations: {
        shiftLeft: '8000000000000000',
        shiftRight: '2000000000000000',
      },
    },
    {
      values: [0x9df0e94e9c, 1],
      operations: {
        shiftLeft: '13be1d29d38',
        shiftRight: '4ef874a74e',
      },
    },
    {
      values: [0x9df0e94e9c, 10],
      operations: {
        shiftLeft: '277c3a53a7000',
        shiftRight: '277c3a53',
      },
    },
    {
      values: ['0xffffffffffffffff', 63],
      operations: {
        shiftLeft: '8000000000000000',
        shiftRight: '1',
      },
    },
    {
      values: ['0xffffffffffffffff', 62],
      operations: {
        shiftLeft: 'c000000000000000',
        shiftRight: '3',
      },
    },
  ].forEach(testcase => {
    Object.keys(testcase.operations).forEach(op => {
      const a = new common.Uint64(testcase.values[0]);
      const b = testcase.values[1];
      if (common.Uint64[op]) {
        const result = common.Uint64[op](a, b);
        test.strictSame(
          result.toString(16),
          testcase.operations[op],
          `must successfully perform binary static operation ${op}` +
            ` on numbers ${testcase.values[0].toString(16)} and` +
            ` ${testcase.values[1]}`
        );
      }
      if (a[op]) {
        a[op](b);
        test.strictSame(
          a.toString(16),
          testcase.operations[op],
          `must successfully perform binary non-static operation ${op}` +
            ` on numbers ${testcase.values[0].toString(16)} and` +
            ` ${testcase.values[1]}`
        );
      }
    });
  });

  test.end();
});

metatests.test('Uint64 unary operators', test => {
  [
    {
      value: '0',
      operations: {
        not: 'ffffffffffffffff',
        inc: '1',
        dec: 'ffffffffffffffff',
      },
    },
    {
      value: '0xffffffffffffffff',
      operations: {
        not: '0',
        inc: '0',
        dec: 'fffffffffffffffe',
      },
    },
    {
      value: '0x00000000ffffffff',
      operations: {
        not: 'ffffffff00000000',
        inc: '100000000',
        dec: 'fffffffe',
      },
    },
    {
      value: '0xffffffff00000000',
      operations: {
        not: 'ffffffff',
        inc: 'ffffffff00000001',
        dec: 'fffffffeffffffff',
      },
    },
    {
      value: '0xf0f0f0f0f0f0f0f0',
      operations: {
        not: 'f0f0f0f0f0f0f0f',
        inc: 'f0f0f0f0f0f0f0f1',
        dec: 'f0f0f0f0f0f0f0ef',
      },
    },
    {
      value: '0x0f0f0f0f0f0f0f0f',
      operations: {
        not: 'f0f0f0f0f0f0f0f0',
        inc: 'f0f0f0f0f0f0f10',
        dec: 'f0f0f0f0f0f0f0e',
      },
    },
  ].forEach(testcase => {
    Object.keys(testcase.operations).forEach(op => {
      const a = new common.Uint64(testcase.value);
      if (common.Uint64[op]) {
        const result = common.Uint64[op](a);
        test.strictSame(
          result.toString(16),
          testcase.operations[op],
          `must successfully perform unary static operation ${op}` +
            ` on number ${testcase.value.toString(16)}`
        );
      }
      if (a[op]) {
        a[op]();
        test.strictSame(
          a.toString(16),
          testcase.operations[op],
          `must successfully perform unary non-static operation ${op}` +
            ` on numbers ${testcase.value.toString(16)}`
        );
      }
    });
  });

  test.end();
});

metatests.test('Uint64.prototype.toString()', test => {
  [
    0,
    1,
    100,
    1234567890,
    0xffffffff,
    Number.MAX_SAFE_INTEGER,
    ['0b1000000000000000000000000000000000000000000000000000000000000000', 2],
    ['0xf000000000000000', 16],
  ].forEach(testcase => {
    if (typeof testcase !== 'number') {
      test.strictSame(
        new common.Uint64(testcase[0]).toString(testcase[1]),
        testcase[0].slice(2),
        `must serialize number ${testcase[0]} with radix ${testcase[1]}`
      );
      return;
    }
    for (let radix = 2; radix <= 36; radix++) {
      test.strictSame(
        new common.Uint64(testcase).toString(radix),
        testcase.toString(radix),
        `must serialize number ${testcase} with radix ${radix}`
      );
    }
  });

  test.end();
});

metatests.test('Uint64.prototype.toUint32()', test => {
  [
    [1, 1],
    [0xffffffff, 0xffffffff],
    ['0xffffffffffffffff', 0xffffffff],
    ['0xffffffff00000000', 0],
  ].forEach(testcase => {
    test.strictSame(
      new common.Uint64(testcase[0]).toUint32(),
      testcase[1],
      `must extract Uint32 number ${testcase[1]} ` +
        `from Uint64 number ${testcase[0]}`
    );
  });

  test.end();
});

metatests.test('Uint64.constructor()', test => {
  [
    {
      value: 10,
      expectedString: '10',
      message: 'must create Uint64 object from a small number',
    },
    {
      value: Number.MAX_SAFE_INTEGER,
      expectedString: Number.MAX_SAFE_INTEGER.toString(),
      message: 'must create Uint64 object from a big number',
    },
    {
      value: {},
      expectedString: '0',
      message: 'must create zero Uint64 from an invalid constructor argument',
    },
    {
      value: NaN,
      expectedString: '0',
      message: 'must create zero Uint64 from a NaN constructor argument',
    },
    {
      value: undefined,
      expectedString: '0',
      message: 'must create zero Uint64 from an undefined constructor argument',
    },
    {
      value: '0xinvalidnumber',
      expectedString: '0',
      message: 'must create zero Uint64 from an invalid hex string',
    },
    {
      value: '0o999',
      expectedString: '0',
      message: 'must create zero Uint64 from an invalid oct string',
    },
    {
      value: '0b333',
      expectedString: '0',
      message: 'must create zero Uint64 from an invalid bin string',
    },
    {
      value: 9999999999999999999999999999999999,
      expectedString: '0',
      message: 'must create zero Uint64 from an unsafe integer number',
    },
    {
      value: '0xffffffffffffffff',
      expectedString: '18446744073709551615',
      message: 'must create Uint64 from a big hex number provided as a string',
    },
    {
      value: '0b10101010101010101010101010101010101010101010101010101010101010',
      expectedString: '3074457345618258602',
      message: 'must create Uint64 from a big bin number provided as a string',
    },
    {
      value:
        '0b1010101010101010101010101010101010101010101010101010101010101010',
      expectedString: '12297829382473034410',
      message: 'must create Uint64 from a big bin number provided as a string',
    },
    {
      value: '0o1777777777777777777777',
      expectedString: '18446744073709551615',
      message: 'must create Uint64 from a big oct number provided as a string',
    },
    {
      value: '18446744073709551615',
      expectedString: '18446744073709551615',
      message: 'must create Uint64 from a big dec number provided as a string',
    },
    {
      value: new common.Int64(1),
      expectedString: '1',
      message: 'must create Uint64 from a small Int64',
    },
    {
      value: new common.Int64('9223372036854775807'),
      expectedString: '9223372036854775807',
      message: 'must create Uint64 from a big Int64',
    },
    {
      value: new common.Int64('-1'),
      expectedString: '18446744073709551615',
      message: 'must create Uint64 from a negative Int64',
    },
  ].forEach(testcase => {
    const uint64 = new common.Uint64(testcase.value);
    test.strictSame(
      uint64.toString(),
      testcase.expectedString,
      testcase.message
    );
  });

  test.end();
});

metatests.test('Uint64 division by zero', test => {
  const nonZeroNumber = new common.Uint64(10);
  const zero = new common.Uint64(0);
  test.throws(
    () => {
      common.Uint64.div(nonZeroNumber, zero);
    },
    new RangeError('Uint64: division by zero'),
    'must throw when dividing by zero'
  );

  test.end();
});

metatests.test('Uint64.prototype.toString() with invalid radix', test => {
  const number = new common.Uint64(10);
  const errorExpected = new RangeError(
    'toString() radix argument must be between 2 and 36'
  );

  test.throws(
    () => {
      number.toString(1000);
    },
    errorExpected,
    'must throw when toString() radix argument is too big'
  );
  test.throws(
    () => {
      number.toString(0);
    },
    errorExpected,
    'must throw when toString() radix argument is too small'
  );
  test.throws(
    () => {
      number.toString(-1);
    },
    errorExpected,
    'must throw when toString() radix argument is negative'
  );

  test.end();
});

metatests.test('Uint64 JSON serialization', test => {
  const zero = new common.Uint64(0);
  const smallNumber = new common.Uint64(10);
  const bigNumber = new common.Uint64('18446744073709551615');
  test.strictEqual(JSON.stringify(zero), '"0"');
  test.strictEqual(JSON.stringify(smallNumber), '"10"');
  test.strictEqual(JSON.stringify(bigNumber), '"18446744073709551615"');
  test.end();
});

metatests.test('Uint64 Postgres serialization', test => {
  const number = new common.Uint64(10);
  const bigNumber = new common.Uint64('18446744073709551615');
  test.strictSame(number.toPostgres(), new common.Int64(10));
  test.strictEqual(bigNumber.toPostgres(), new common.Int64(-1));
  test.end();
});
