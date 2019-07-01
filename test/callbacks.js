'use strict';

const metatests = require('metatests');
const common = require('..');

metatests.case(
  'Common / callbacks',
  { common },
  {
    'common.falseness': [[[], false]],
    'common.trueness': [[[], true]],
    'common.emptyness': [[[], undefined]],
  }
);

metatests.test('unsafeCallback', test => {
  const callback = (...args) => {
    test.strictSame(args, [1, 2, 3]);
    test.end();
  };
  const args = [1, 2, 3, callback];
  const cb = common.unsafeCallback(args);
  test.strictSame(cb, callback);
  cb(...args);
});

metatests.test('unsafeCallback without callback', test => {
  const args = ['a', 'b', 'c'];
  const cb = common.unsafeCallback(args);
  test.strictSame(args, ['a', 'b', 'c']);
  test.strictSame(cb, null);
  test.end();
});

metatests.test('safeCallback', test => {
  const callback = (...args) => {
    test.strictSame(args, [10, 20, 30, 40, 50]);
    test.end();
  };
  const args = [10, 20, 30, 40, 50, callback];
  const wrappedCb = common.safeCallback(args);
  test.strictSame(typeof wrappedCb, 'function');
  wrappedCb(...args);
});

metatests.test('safeCallback without callback', test => {
  const args = [11, 22, 33];
  const wrappedCb = common.safeCallback(args);
  test.strictSame(args, [11, 22, 33]);
  test.strictSame(wrappedCb, common.emptiness);
  test.end();
});

metatests.test('safeCallback return emptiness', test => {
  const args = [3, 2, 1];
  const wrappedCb = common.safeCallback(args);
  test.strictSame(wrappedCb, common.emptiness);
  wrappedCb(...args);
  test.end();
});

metatests.test('onceCallback prevent callback twice', test => {
  const callback = (...args) => {
    test.strictSame(args, ['A', 'B', 'C']);
    test.end();
  };
  const args = ['A', 'B', 'C', callback];
  const wrappedCb = common.onceCallback(args);
  test.strictSame(typeof wrappedCb, 'function');
  wrappedCb(...args);
  wrappedCb(...args);
});

metatests.test('onceCallback without callback', test => {
  const args = ['A', 'B', 'C'];
  const wrappedCb = common.onceCallback(args);
  test.strictSame(wrappedCb, common.emptiness);
  test.end();
});

metatests.test('requiredCallback', test => {
  const callback = (...args) => {
    test.strictSame(args, [100, 200, 300]);
    test.end();
  };
  const args = [100, 200, 300, callback];
  const wrappedCb = common.requiredCallback(args);
  test.strictSame(typeof wrappedCb, 'function');
  wrappedCb(...args);
});

metatests.test('requiredCallback raise', test => {
  const args = [-1, -2, -3];
  try {
    const wrappedCb = common.requiredCallback(args);
    wrappedCb(...args);
  } catch (err) {
    test.strictSame(!!err, true);
    test.end();
  }
});

metatests.test('once', test => {
  const fn = () => {
    test.end();
  };
  const wrapped = common.once(fn);
  wrapped();
  wrapped();
});

metatests.test('once without function', test => {
  const wrapped = common.once(null);
  test.strictSame(wrapped, common.emptiness);
  wrapped();
  test.end();
});

metatests.test('nop', test => {
  const callback = err => {
    test.strictSame(err, null);
    test.end();
  };

  common.nop(callback);
});

metatests.test('noop', test => {
  const incomingValue = 42;
  const callback = (err, result) => {
    test.strictSame(err, null);
    test.strictSame(result, null);
    test.end();
  };

  common.noop(incomingValue, callback);
});

metatests.test('unsafeFunction', test => {
  const fn = () => 42;
  const otherValue = 42;
  test.strictSame(common.unsafeFunction(fn), fn);
  test.strictSame(common.unsafeFunction(otherValue), null);
  test.end();
});

metatests.test('safeFunction', test => {
  const fn = () => 42;
  const otherValue = 42;
  test.strictSame(common.safeFunction(fn), fn);
  test.strictSame(common.safeFunction(otherValue), common.emptiness);
  test.end();
});

metatests.test('identity function', test => {
  test.strictSame(common.id(10), 10);
  test.strictSame(common.id({ data: 10 }), { data: 10 });
  test.end();
});

metatests.test('async identity function', test => {
  let sync = true;
  const cb = (err, data) => {
    test.error(err);
    test.assertNot(sync);
    test.strictSame(data, { data: 10 });
    test.end();
  };

  common.asyncId({ data: 10 }, cb);
  sync = false;
});
