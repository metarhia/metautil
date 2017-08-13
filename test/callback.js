'use strict';

const tap = require('tap');
const common = require('..');

tap.test('safeCallback', (test) => {
  const callback = (...args) => {
    test.strictSame(args, [1, 2, 3]);
    test.end();
  };
  const args = [1, 2, 3, callback];
  const wrappedCb = common.safeCallback(args);
  test.strictSame(typeof(wrappedCb), 'function');
  wrappedCb(...args);
});

tap.test('safeCallback without callback', (test) => {
  const args = [1, 2, 3];
  const wrappedCb = common.safeCallback(args);
  test.strictSame(args, [1, 2, 3]);
  test.strictSame(wrappedCb, common.emptiness);
  test.end();
});

tap.test('safeCallback prevent callback twice', (test) => {
  const callback = (...args) => {
    test.strictSame(args, [1, 2, 3]);
    test.end();
  };
  const args = [1, 2, 3, callback];
  const wrappedCb = common.safeCallback(args);
  test.strictSame(typeof(wrappedCb), 'function');
  wrappedCb(...args);
  wrappedCb(...args);
});

tap.test('unsafeCallback', (test) => {
  const callback = (...args) => {
    test.strictSame(args, [1, 2, 3]);
    test.end();
  };
  const args = [1, 2, 3, callback];
  const cb = common.unsafeCallback(args);
  test.strictSame(cb, callback);
  cb(...args);
});

tap.test('unsafeCallback without callback', (test) => {
  const args = [1, 2, 3];
  const cb = common.unsafeCallback(args);
  test.strictSame(args, [1, 2, 3]);
  test.strictSame(cb, null);
  test.end();
});

tap.test('once', (test) => {
  const fn = () => {
    test.end();
  };
  const wrapped = common.once(fn);
  wrapped();
  wrapped();
});

tap.test('once without function', (test) => {
  const wrapped = common.once(null);
  test.strictSame(wrapped, common.emptiness);
  wrapped();
  test.end();
});
