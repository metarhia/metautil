'use strict';

const tap = require('tap');
const metasync = require('..');

tap.test('restLeft', (test) => {
  const expectedArgs = [3, 4, 5];
  const expectedArg1 = 1;
  const expectedArg2 = 2;
  const expectedCallbackArgs = [6, 7, 8];
  const af = metasync.restLeft((args, arg1, arg2, callback) => {
    test.strictSame(args, expectedArgs);
    test.strictSame(arg1, expectedArg1);
    test.strictSame(arg2, expectedArg2);
    callback(6, 7, 8);
  });
  af(1, 2, 3, 4, 5, (...args) => {
    test.strictSame(args, expectedCallbackArgs);
    test.end();
  });
});

