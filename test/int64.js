'use strict';

const metatests = require('metatests');
const common = require('..');

metatests.test('Int64 binary operators', test => {
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
        sub: '-1',
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
      values: [0, -1],
      operations: {
        add: '-1',
        sub: '1',
        mult: '0',
        div: '0',
        mod: '0',
        cmp: 1,
        and: '0',
        or: '-1',
        xor: '-1',
      },
    },
    {
      values: [-1, 0],
      operations: {
        add: '-1',
        sub: '-1',
        mult: '0',
        cmp: -1,
        and: '0',
        or: '-1',
        xor: '-1',
      },
    },
    {
      values: [-1, -1],
      operations: {
        add: '-2',
        sub: '0',
        mult: '1',
        div: '1',
        mod: '0',
        cmp: 0,
        and: '-1',
        or: '-1',
        xor: '0',
      },
    },
    {
      values: [-1, -2],
      operations: {
        add: '-3',
        sub: '1',
        mult: '2',
        div: '0',
        mod: '-1',
        cmp: 1,
        and: '-2',
        or: '-1',
        xor: '1',
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
      values: [-1023, 2],
      operations: {
        add: '-3fd',
        sub: '-401',
        mult: '-7fe',
        div: '-1ff',
        mod: '-1',
        cmp: -1,
        and: '0',
        or: '-3fd',
        xor: '-3fd',
      },
    },
    {
      values: [0x7fffffff, 0x7fffffff],
      operations: {
        add: 'fffffffe',
        sub: '0',
        mult: '3fffffff00000001',
        div: '1',
        mod: '0',
        cmp: 0,
        and: '7fffffff',
        or: '7fffffff',
        xor: '0',
      },
    },
    {
      values: [0x80000000, 0x80000000],
      operations: {
        add: '100000000',
        sub: '0',
        mult: '4000000000000000',
        div: '1',
        mod: '0',
        cmp: 0,
        and: '80000000',
        or: '80000000',
        xor: '0',
      },
    },
    {
      values: [0xffffffff, 0xffffffff],
      operations: {
        add: '1fffffffe',
        sub: '0',
        mult: '-1ffffffff',
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
        '0b0010000000000000000000000000000000000000000000000000000000000000',
      ],
      operations: {
        add: '2000000000000002',
        mult: '4000000000000000',
        cmp: -1,
        and: '0',
        or: '2000000000000002',
        xor: '2000000000000002',
      },
    },
    {
      values: [
        '0b0000000000000000000000000000000000000000000000000000000000000001',
        '0b0010000000000000000000000000000000000000000000000000000000000000',
      ],
      operations: {
        add: '2000000000000001',
        mult: '2000000000000000',
        cmp: -1,
        and: '0',
        or: '2000000000000001',
        xor: '2000000000000001',
      },
    },
    {
      values: [
        '0b0010000000000000000000000000000000000000000000000000000000000000',
        '0b0000000000000000000000000000000000000000000000000000000000000001',
      ],
      operations: {
        add: '2000000000000001',
        mult: '2000000000000000',
        cmp: 1,
        and: '0',
        or: '2000000000000001',
        xor: '2000000000000001',
      },
    },
    {
      values: ['0x7ffffffffffffffe', '1'],
      operations: {
        add: '7fffffffffffffff',
        mult: '7ffffffffffffffe',
        cmp: 1,
        and: '0',
        or: '7fffffffffffffff',
        xor: '7fffffffffffffff',
      },
    },
    {
      values: ['0x7fffffffffff0000', '0xffff'],
      operations: {
        add: '7fffffffffffffff',
        cmp: 1,
        and: '0',
        or: '7fffffffffffffff',
        xor: '7fffffffffffffff',
      },
    },
    {
      values: ['-9223372036854775807', '1'],
      operations: {
        add: '-7ffffffffffffffe',
        sub: '-8000000000000000',
        mult: '-7fffffffffffffff',
        cmp: -1,
        and: '1',
        or: '-7fffffffffffffff',
        xor: '-8000000000000000',
      },
    },
    {
      values: ['-9223372036854775808', '1'],
      operations: {
        mult: '-8000000000000000',
        cmp: -1,
        and: '0',
        or: '-7fffffffffffffff',
        xor: '-7fffffffffffffff',
      },
    },
    {
      values: ['9223372036854775807', '1'],
      operations: {
        mult: '7fffffffffffffff',
        cmp: 1,
        and: '1',
        or: '7fffffffffffffff',
        xor: '7ffffffffffffffe',
      },
    },
    {
      values: ['9223372036854775807', '-9223372036854775808'],
      operations: {
        add: '-1',
        cmp: 1,
        and: '0',
        or: '-1',
        xor: '-1',
      },
    },
  ].forEach(testcase => {
    Object.keys(testcase.operations).forEach(op => {
      const a = new common.Int64(testcase.values[0]);
      const b = new common.Int64(testcase.values[1]);
      if (common.Int64[op]) {
        const result = common.Int64[op](a, b);
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

metatests.test('Int64 binary operators with numbers', test => {
  [
    {
      values: [0, 0],
      operations: {
        shiftLeft: '0',
        shiftRight: '0',
        shiftRightLogical: '0',
        shiftRightArithmetic: '0',
      },
    },
    {
      values: [0, 1],
      operations: {
        shiftLeft: '0',
        shiftRight: '0',
        shiftRightLogical: '0',
        shiftRightArithmetic: '0',
      },
    },
    {
      values: [1, 1],
      operations: {
        shiftLeft: '2',
        shiftRight: '0',
        shiftRightLogical: '0',
        shiftRightArithmetic: '0',
      },
    },
    {
      values: [-1, 1],
      operations: {
        shiftLeft: '-2',
        shiftRight: '-1',
        shiftRightLogical: '7fffffffffffffff',
        shiftRightArithmetic: '-1',
      },
    },
    {
      values: [1, 0],
      operations: {
        shiftLeft: '1',
        shiftRight: '1',
        shiftRightLogical: '1',
        shiftRightArithmetic: '1',
      },
    },
    {
      values: [-1, 0],
      operations: {
        shiftLeft: '-1',
        shiftRight: '-1',
        shiftRightLogical: '-1',
        shiftRightArithmetic: '-1',
      },
    },
    {
      values: [1, 32],
      operations: {
        shiftLeft: '100000000',
        shiftRight: '0',
        shiftRightLogical: '0',
        shiftRightArithmetic: '0',
      },
    },
    {
      values: [1, 31],
      operations: {
        shiftLeft: '80000000',
        shiftRight: '0',
        shiftRightLogical: '0',
        shiftRightArithmetic: '0',
      },
    },
    {
      values: [-1234567, 1],
      operations: {
        shiftLeft: '-25ad0e',
        shiftRight: '-96b44',
        shiftRightLogical: '7ffffffffff694bc',
        shiftRightArithmetic: '-96b44',
      },
    },
    {
      values: [-1234567, 31],
      operations: {
        shiftLeft: '-96b4380000000',
        shiftRight: '-1',
        shiftRightLogical: '1ffffffff',
        shiftRightArithmetic: '-1',
      },
    },
    {
      values: [-1234567, 63],
      operations: {
        shiftLeft: '-8000000000000000',
        shiftRight: '-1',
        shiftRightLogical: '1',
        shiftRightArithmetic: '-1',
      },
    },
    {
      values: [0x80000000, 31],
      operations: {
        shiftLeft: '4000000000000000',
        shiftRight: '1',
        shiftRightLogical: '1',
        shiftRightArithmetic: '1',
      },
    },
    {
      values: ['0x8000000080000000', 31],
      operations: {
        shiftLeft: '4000000000000000',
        shiftRight: '-ffffffff',
        shiftRightLogical: '100000001',
        shiftRightArithmetic: '-ffffffff',
      },
    },
    {
      values: ['0x4000000000000000', 2],
      operations: {
        shiftLeft: '0',
        shiftRight: '1000000000000000',
        shiftRightLogical: '1000000000000000',
        shiftRightArithmetic: '1000000000000000',
      },
    },
    {
      values: ['0x2000000000000000', 1],
      operations: {
        shiftLeft: '4000000000000000',
        shiftRight: '1000000000000000',
        shiftRightLogical: '1000000000000000',
        shiftRightArithmetic: '1000000000000000',
      },
    },
    {
      values: [0x9df0e94e9c, 1],
      operations: {
        shiftLeft: '13be1d29d38',
        shiftRight: '4ef874a74e',
        shiftRightLogical: '4ef874a74e',
        shiftRightArithmetic: '4ef874a74e',
      },
    },
    {
      values: [0x9df0e94e9c, 10],
      operations: {
        shiftLeft: '277c3a53a7000',
        shiftRight: '277c3a53',
        shiftRightLogical: '277c3a53',
        shiftRightArithmetic: '277c3a53',
      },
    },
    {
      values: ['0x7fffffffffffffff', 62],
      operations: {
        shiftLeft: '-4000000000000000',
        shiftRight: '1',
        shiftRightLogical: '1',
        shiftRightArithmetic: '1',
      },
    },
    {
      values: ['0x7fffffffffffffff', 61],
      operations: {
        shiftLeft: '-2000000000000000',
        shiftRight: '3',
        shiftRightLogical: '3',
        shiftRightArithmetic: '3',
      },
    },
    {
      values: ['0xffffffffffffffff', 61],
      operations: {
        shiftLeft: '-2000000000000000',
        shiftRight: '-1',
        shiftRightLogical: '7',
        shiftRightArithmetic: '-1',
      },
    },
    {
      values: ['0xf0f0f0f0f0f0f0f0', 1],
      operations: {
        shiftLeft: '-1e1e1e1e1e1e1e20',
        shiftRight: '-787878787878788',
        shiftRightLogical: '7878787878787878',
        shiftRightArithmetic: '-787878787878788',
      },
    },
    {
      values: ['0xf0f0f0f0f0f0f0f0', 2],
      operations: {
        shiftLeft: '-3c3c3c3c3c3c3c40',
        shiftRight: '-3c3c3c3c3c3c3c4',
        shiftRightLogical: '3c3c3c3c3c3c3c3c',
        shiftRightArithmetic: '-3c3c3c3c3c3c3c4',
      },
    },
  ].forEach(testcase => {
    Object.keys(testcase.operations).forEach(op => {
      const a = new common.Int64(testcase.values[0]);
      const b = testcase.values[1];
      if (common.Int64[op]) {
        const result = common.Int64[op](a, b);
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

metatests.test('Int64 unary operators', test => {
  [
    {
      value: '0',
      operations: {
        not: '-1',
        inc: '1',
        dec: '-1',
      },
    },
    {
      value: '0xffffffffffffffff',
      operations: {
        not: '0',
        inc: '0',
        dec: '-2',
      },
    },
    {
      value: '0x00000000ffffffff',
      operations: {
        not: '-100000000',
        inc: '100000000',
        dec: 'fffffffe',
      },
    },
    {
      value: '0xffffffff00000000',
      operations: {
        not: 'ffffffff',
        inc: '-ffffffff',
        dec: '-100000001',
      },
    },
    {
      value: '0xf0f0f0f0f0f0f0f0',
      operations: {
        not: 'f0f0f0f0f0f0f0f',
        inc: '-f0f0f0f0f0f0f0f',
        dec: '-f0f0f0f0f0f0f11',
      },
    },
    {
      value: '0x0f0f0f0f0f0f0f0f',
      operations: {
        not: '-f0f0f0f0f0f0f10',
        inc: 'f0f0f0f0f0f0f10',
        dec: 'f0f0f0f0f0f0f0e',
      },
    },
  ].forEach(testcase => {
    Object.keys(testcase.operations).forEach(op => {
      const a = new common.Int64(testcase.value);
      if (common.Int64[op]) {
        const result = common.Int64[op](a);
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

metatests.test('Int64.prototype.toString()', test => {
  [
    0,
    1,
    -1,
    100,
    -100,
    1234567890,
    -1234567890,
    0xffffffff,
    -4294967295,
    Number.MAX_SAFE_INTEGER,
    -Number.MAX_SAFE_INTEGER,
    ['0b100000000000000000000000000000000000000000000000000000000000000', 2],
    ['0x7000000000000000', 16],
    ['0x7fffffffffffffff', 16],
  ].forEach(testcase => {
    if (typeof testcase !== 'number') {
      test.strictSame(
        new common.Int64(testcase[0]).toString(testcase[1]),
        testcase[0].slice(2),
        `must serialize number ${testcase[0]} with radix ${testcase[1]}`
      );
      return;
    }
    for (let radix = 2; radix <= 36; radix++) {
      test.strictSame(
        new common.Int64(testcase).toString(radix),
        testcase.toString(radix),
        `must serialize number ${testcase} with radix ${radix}`
      );
    }
  });

  test.end();
});

metatests.test('Int64.prototype.toInt32()', test => {
  [
    [0, 0],
    [1, 1],
    [-1, -1],
    [10, 10],
    [-10, -10],
    [0xffffffff, -1],
    ['0xffffffff00000001', 1],
    ['0xffffffff00000000', 0],
  ].forEach(testcase => {
    test.strictSame(
      new common.Int64(testcase[0]).toInt32(),
      testcase[1],
      `must extract Int32 number ${testcase[1]} ` +
        `from Int64 number ${testcase[0]}`
    );
  });

  test.end();
});

metatests.test('Int64.prototype.toUint32()', test => {
  [
    [0, 0],
    [1, 1],
    [-1, 4294967295],
    [10, 10],
    [-10, 4294967286],
    [0xffffffff, 4294967295],
    ['0xffffffff00000001', 1],
    ['0xffffffff00000000', 0],
  ].forEach(testcase => {
    test.strictSame(
      new common.Int64(testcase[0]).toUint32(),
      testcase[1],
      `must extract Uint32 number ${testcase[1]} ` +
        `from Int64 number ${testcase[0]}`
    );
  });

  test.end();
});

metatests.test('Int64.constructor()', test => {
  [
    {
      value: 10,
      expectedString: '10',
      message: 'must create Int64 object from a small number',
    },
    {
      value: -10,
      expectedString: '-10',
      message: 'must create Int64 object from a small number',
    },
    {
      value: Number.MAX_SAFE_INTEGER,
      expectedString: Number.MAX_SAFE_INTEGER.toString(),
      message: 'must create Int64 object from a big number',
    },
    {
      value: -Number.MAX_SAFE_INTEGER,
      expectedString: '-' + Number.MAX_SAFE_INTEGER.toString(),
      message: 'must create Int64 object from a big number',
    },
    {
      value: {},
      expectedString: '0',
      message: 'must create zero Int64 from an invalid constructor argument',
    },
    {
      value: NaN,
      expectedString: '0',
      message: 'must create zero Int64 from a NaN constructor argument',
    },
    {
      value: undefined,
      expectedString: '0',
      message: 'must create zero Int64 from an undefined constructor argument',
    },
    {
      value: '0xinvalidnumber',
      expectedString: '0',
      message: 'must create zero Int64 from an invalid hex string',
    },
    {
      value: '0o999',
      expectedString: '0',
      message: 'must create zero Int64 from an invalid oct string',
    },
    {
      value: '0b333',
      expectedString: '0',
      message: 'must create zero Int64 from an invalid bin string',
    },
    {
      value: 9999999999999999999999999999999999,
      expectedString: '0',
      message: 'must create zero Int64 from an unsafe integer number',
    },
    {
      value: -9999999999999999999999999999999999,
      expectedString: '0',
      message: 'must create zero Int64 from an unsafe integer number',
    },
    {
      value: '0xffffffffffffffff',
      expectedString: '-1',
      message: 'must create Int64 from a big hex number provided as a string',
    },
    {
      value: '0x7fffffffffffffff',
      expectedString: '9223372036854775807',
      message: 'must create Int64 from a big hex number provided as a string',
    },
    {
      value:
        '0b1010101010101010101010101010101010101010101010101010101010101010',
      expectedString: '-6148914691236517206',
      message: 'must create Int64 from a big bin number provided as a string',
    },
    {
      value: '0b10101010101010101010101010101010101010101010101010101010101010',
      expectedString: '3074457345618258602',
      message: 'must create Int64 from a big bin number provided as a string',
    },
    {
      value: '0o1777777777777777777777',
      expectedString: '-1',
      message: 'must create Int64 from a big oct number provided as a string',
    },
    {
      value: '0o777777777777777777777',
      expectedString: '9223372036854775807',
      message: 'must create Int64 from a big oct number provided as a string',
    },
    {
      value: '9223372036854775807',
      expectedString: '9223372036854775807',
      message: 'must create Int64 from a big dec number provided as a string',
    },
    {
      value: '-9223372036854775807',
      expectedString: '-9223372036854775807',
      message: 'must create Int64 from a big dec number provided as a string',
    },
    {
      value: '-9223372036854775808',
      expectedString: '-9223372036854775808',
      message: 'must create Int64 from a big dec number provided as a string',
    },
  ].forEach(testcase => {
    const Int64 = new common.Int64(testcase.value);
    test.strictSame(
      Int64.toString(),
      testcase.expectedString,
      testcase.message
    );
  });

  test.end();
});

metatests.test('Int64 division by zero', test => {
  const nonZeroNumber = new common.Int64(10);
  const zero = new common.Int64(0);
  test.throws(
    () => {
      common.Int64.div(nonZeroNumber, zero);
    },
    new RangeError('Int64: division by zero'),
    'must throw when dividing by zero'
  );

  test.end();
});

metatests.test('Int64.prototype.toString() with invalid radix', test => {
  const number = new common.Int64(10);
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

metatests.test('Int64 JSON serialization', test => {
  const zero = new common.Int64(0);
  const smallNumber = new common.Int64(10);
  const bigNumber = new common.Int64('9223372036854775807');
  const bigNegativeNumber = new common.Int64('-9223372036854775808');
  test.strictEqual(JSON.stringify(zero), '"0"');
  test.strictEqual(JSON.stringify(smallNumber), '"10"');
  test.strictEqual(JSON.stringify(bigNumber), '"9223372036854775807"');
  test.strictEqual(JSON.stringify(bigNegativeNumber), '"-9223372036854775808"');
  test.end();
});

metatests.test('Int64 Postgres serialization', test => {
  const zero = new common.Int64(0);
  const smallNumber = new common.Int64(10);
  const bigNumber = new common.Int64('9223372036854775807');
  const bigNegativeNumber = new common.Int64('-9223372036854775808');
  test.strictEqual(zero.toPostgres(), '0');
  test.strictEqual(smallNumber.toPostgres(), '10');
  test.strictEqual(bigNumber.toPostgres(), '9223372036854775807');
  test.strictEqual(bigNegativeNumber.toPostgres(), '-9223372036854775808');
  test.end();
});
