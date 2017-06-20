'use strict';

const tap = require('tap');
const common = require('..');

tap.test('cbExctract', (test) => {
  const expectedArgs = [1, 2, 3];
  const expectedCallbackArgs = [4, 5, 6];
  const callback = (...args) => {
    test.strictSame(args, expectedCallbackArgs);
    test.end();
  };
  const args = [1, 2, 3, callback];
  const wrappedCb = common.cbExtract(args);
  test.strictSame(args, expectedArgs);
  wrappedCb(4, 5, 6);
});

tap.test('cbExctract without callback', (test) => {
  const expectedArgs = [1, 2, 3];
  const args = [1, 2, 3];
  const wrappedCb = common.cbExtract(args);
  test.strictSame(args, expectedArgs);
  test.strictSame(wrappedCb, common.falseness);
  test.end();
});
