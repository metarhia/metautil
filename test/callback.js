'use strict';

api.metatests.case('Common / callbacks', {
  'common.falseness': [[[],     false]],
  'common.trueness':  [[[],      true]],
  'common.emptyness': [[[], undefined]],
});

api.metatests.test('unsafeCallback', (test) => {
  const callback = (...args) => {
    test.strictSame(args, [1, 2, 3]);
    test.end();
  };
  const args = [1, 2, 3, callback];
  const cb = api.common.unsafeCallback(args);
  test.strictSame(cb, callback);
  cb(...args);
});

api.metatests.test('unsafeCallback without callback', (test) => {
  const args = [1, 2, 3];
  const cb = api.common.unsafeCallback(args);
  test.strictSame(args, [1, 2, 3]);
  test.strictSame(cb, null);
  test.end();
});

api.metatests.test('safeCallback', (test) => {
  const callback = (...args) => {
    test.strictSame(args, [1, 2, 3]);
    test.end();
  };
  const args = [1, 2, 3, callback];
  const wrappedCb = api.common.safeCallback(args);
  test.strictSame(typeof(wrappedCb), 'function');
  wrappedCb(...args);
});

api.metatests.test('safeCallback without callback', (test) => {
  const args = [1, 2, 3];
  const wrappedCb = api.common.safeCallback(args);
  test.strictSame(args, [1, 2, 3]);
  test.strictSame(wrappedCb, api.common.emptiness);
  test.end();
});

api.metatests.test('safeCallback', (test) => {
  const callback = (...args) => {
    test.strictSame(args, [1, 2, 3]);
    test.end();
  };
  const args = [1, 2, 3, callback];
  const wrappedCb = api.common.safeCallback(args);
  test.strictSame(typeof(wrappedCb), 'function');
  wrappedCb(...args);
});

api.metatests.test('safeCallback return emptiness', (test) => {
  const args = [1, 2, 3];
  const wrappedCb = api.common.safeCallback(args);
  test.strictSame(wrappedCb, api.common.emptiness);
  wrappedCb(...args);
  test.end();
});

api.metatests.test('onceCallback prevent callback twice', (test) => {
  const callback = (...args) => {
    test.strictSame(args, [1, 2, 3]);
    test.end();
  };
  const args = [1, 2, 3, callback];
  const wrappedCb = api.common.onceCallback(args);
  test.strictSame(typeof(wrappedCb), 'function');
  wrappedCb(...args);
  wrappedCb(...args);
});

api.metatests.test('requiredCallback', (test) => {
  const callback = (...args) => {
    test.strictSame(args, [1, 2, 3]);
    test.end();
  };
  const args = [1, 2, 3, callback];
  const wrappedCb = api.common.requiredCallback(args);
  test.strictSame(typeof(wrappedCb), 'function');
  wrappedCb(...args);
});

api.metatests.test('requiredCallback raise', (test) => {
  const args = [1, 2, 3];
  try {
    const wrappedCb = api.common.requiredCallback(args);
    wrappedCb(...args);
  } catch (err) {
    test.strictSame(!!err, true);
    test.end();
  }
});

api.metatests.test('once', (test) => {
  const fn = () => {
    test.end();
  };
  const wrapped = api.common.once(fn);
  wrapped();
  wrapped();
});

api.metatests.test('once without function', (test) => {
  const wrapped = api.common.once(null);
  test.strictSame(wrapped, api.common.emptiness);
  wrapped();
  test.end();
});
