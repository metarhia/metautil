'use strict';

const tap = require('tap');
const common = require('..');

tap.test('duration', (test) => {
  const cases = [
    [            500, 500      ],
    [              0, 0        ],
    [           '9s', 9000     ],
    [           '7m', 420000   ],
    [           '5h', 18000000 ],
    [           '2d', 172800000],
    [             '', 0        ],
    [           null, 0        ],
    [      undefined, 0        ],
    [           '15', 0        ],
    [          '10q', 0        ],
    [       '2d 43s', 172843000],
    ['5d 17h 52m 1s', 496321000],
    ['1d 10h 7m 13s', 122833000],
  ];
  cases.forEach((testCase) => {
    const [value, expected] = testCase;
    const result = common.duration(value);
    test.strictSame(result, expected);
  });
  test.end();
});

tap.test('bytesToSize', (test) => {
  const cases = [
    [                         0, '0'      ],
    [                         1, '1'      ],
    [                       100, '100'    ],
    [                       999, '999'    ],
    [                      1000, '1 Kb'   ],
    [                      1023, '1 Kb'   ],
    [                      1024, '1 Kb'   ],
    [                      1025, '1 Kb'   ],
    [                      1111, '1 Kb'   ],
    [                      2222, '2 Kb'   ],
    [                     10000, '10 Kb'  ],
    [                   1000000, '1 Mb'   ],
    [                 100000000, '100 Mb' ],
    [               10000000000, '10 Gb'  ],
    [             1000000000000, '1 Tb'   ],
    [           100000000000000, '100 Tb' ],
    [         10000000000000000, '10 Pb'  ],
    [       1000000000000000000, '1 Eb'   ],
    [     100000000000000000000, '100 Eb' ],
    [   10000000000000000000000, '10 Zb'  ],
    [ 1000000000000000000000000, '1 Yb'   ],
  ];
  cases.forEach((testCase) => {
    const [value, expected] = testCase;
    const result = common.bytesToSize(value);
    test.strictSame(result, expected);
  });
  test.end();
});

tap.test('sizeToBytes', (test) => {
  const cases = [
    [       '',                       NaN ],
    [        0,                         0 ],
    [      '0',                         0 ],
    [      '1',                         1 ],
    [      512,                       512 ],
    [    '100',                       100 ],
    [    '999',                       999 ],
    [   '1 Kb',                      1000 ],
    [   '2 Kb',                      2000 ],
    [  '10 Kb',                     10000 ],
    [   '1 Mb',                   1000000 ],
    [ '100 Mb',                 100000000 ],
    [  '10 Gb',               10000000000 ],
    [   '1 Tb',             1000000000000 ],
    [ '100 Tb',           100000000000000 ],
    [  '10 Pb',         10000000000000000 ],
    [   '1 Eb',       1000000000000000000 ],
    [ '100 Eb',     100000000000000000000 ],
    [  '10 Zb',   10000000000000000000000 ],
    [   '1 Yb', 1000000000000000000000000 ],
  ];
  cases.forEach((testCase) => {
    const [value, expected] = testCase;
    const result = common.sizeToBytes(value);
    test.strictSame(result, expected);
  });
  test.end();
});
