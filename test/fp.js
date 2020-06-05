'use strict';

const metatests = require('metatests');
const common = require('..');

metatests.test('partial ', test => {
  const func = (a, b, c, d) => a + b + c + d;
  const fn1 = common.partial(func);
  const fn2 = common.partial(func, 10);
  const fn3 = common.partial(func, 10, 20);
  const fn4 = common.partial(func, 10, 20, 30);
  const fn5 = common.partial(func, 10, 20, 30, 40);
  const result1 = fn1(10, 20, 30, 40);
  const result2 = fn2(20, 30, 40);
  const result3 = fn3(30, 40);
  const result4 = fn4(40);
  const result5 = fn5();
  test.strictSame(result1, 100);
  test.strictSame(result2, 100);
  test.strictSame(result3, 100);
  test.strictSame(result4, 100);
  test.strictSame(result5, 100);
  test.end();
});

metatests.test('omap', test => {
  const persons = {
    vlad: { age: 20, side: 'good' },
    dziuba: { age: 20, side: 'evil' },
  };
  const expected = { vlad: 'good', dziuba: 'evil' };
  const result = common.omap(p => p.side, persons);
  test.strictSame(result, expected);
  test.end();
});

metatests.test('compose', test => {
  const fn1 = x => x + 1;
  const fn2 = x => x * 3;
  const fn3 = x => x - 2;

  const composedFunction = common.compose(fn1, fn2, fn3);
  test.strictSame(composedFunction(4), 13);
  test.strictSame(composedFunction(10), 31);

  test.end();
});

metatests.test('compose without arguments', test => {
  const emptyComposed = common.compose();
  test.strictSame(emptyComposed(1, 2, 3), 1);
  test.end();
});

metatests.test('maybe', test => {
  const fn = (expected, mustCall) => {
    const f = actual => {
      test.strictSame(actual, expected);
      return actual * 2;
    };
    return mustCall ? test.mustCall(f) : test.mustNotCall(f);
  };

  test.strictSame(common.maybe(fn(2, true), 2, 2), 4);
  test.strictSame(common.maybe(fn(1), 2, undefined), 2);
  test.strictSame(common.maybe(fn(1), 2, null), 2);
  test.strictSame(common.maybe(fn(0, true), 1, 0), 0);
  test.end();
});

metatests.test('zip', test => {
  const data = [
    [1, 2, 3],
    ['one', 'two', 'three'],
    ['один', 'два', 'три'],
  ];
  const expected = [
    [1, 'one', 'один'],
    [2, 'two', 'два'],
    [3, 'three', 'три'],
  ];
  const res = common.zip(...data);
  test.strictSame(res, expected);
  test.end();
});

metatests.test('zip with no elements', test => {
  const res = common.zip();
  test.strictSame(res, []);
  test.end();
});

metatests.test('replicate', test => {
  const expected = [true, true, true, true, true];
  const result = common.replicate(5, true);
  test.strictSame(result, expected);
  test.end();
});

metatests.test('zipWith', test => {
  const data = [
    [1, 2, 3],
    ['one', 'two', 'three'],
    ['один', 'два', 'три'],
  ];
  const makeDict = (num, eng, rus) => ({ num, eng, rus });
  const expected = [
    { num: 1, eng: 'one', rus: 'один' },
    { num: 2, eng: 'two', rus: 'два' },
    { num: 3, eng: 'three', rus: 'три' },
  ];
  const res = common.zipWith(makeDict, ...data);
  test.strictSame(res, expected);
  test.end();
});

metatests.test('curry(f)(1)(2)(3)', test => {
  const sum = (x, y, z) => x + y + z;
  const res = common.curry(sum)(1)(2)(3);
  test.strictSame(res, 6);
  test.end();
});

metatests.test('curry(f, 1)(2)(3)', test => {
  const sum = (x, y, z) => x + y + z;
  const res = common.curry(sum, 1)(2)(3);
  test.strictSame(res, 6);
  test.end();
});

metatests.test('curry(f, 1, 2)(3)', test => {
  const sum = (x, y, z) => x + y + z;
  const res = common.curry(sum, 1, 2)(3);
  test.strictSame(res, 6);
  test.end();
});

metatests.test('curry(f, 1, 2, 3)', test => {
  const sum = (x, y, z) => x + y + z;
  const res = common.curry(sum, 1, 2, 3);
  test.strictSame(res, 6);
  test.end();
});

metatests.test('curry(f, 1)(2, 3)', test => {
  const sum = (x, y, z) => x + y + z;
  const res = common.curry(sum, 1)(2, 3);
  test.strictSame(res, 6);
  test.end();
});

metatests.test('curry(f)(1, 2, 3)', test => {
  const sum = (x, y, z) => x + y + z;
  const res = common.curry(sum)(1, 2, 3);
  test.strictSame(res, 6);
  test.end();
});

metatests.testSync('multiple curry of sum(x, y)', test => {
  const sum = (x, y) => x + y;
  const sumCurry = common.curry(sum);
  const addOne = sumCurry(1);
  const addTwo = sumCurry(2);
  test.strictSame(addOne(10), 11);
  test.strictSame(addOne(20), 21);
  test.strictSame(addTwo(10), 12);
  test.strictSame(addTwo(20), 22);
});

metatests.testSync('multiple curry of sum(x, y, z)', test => {
  const sum = (x, y, z) => x + y + z;
  const sumCurry = common.curry(sum);
  const addOneTwo = sumCurry(1, 2);
  const addTwoThree = sumCurry(2, 3);
  test.strictSame(addOneTwo(10), 13);
  test.strictSame(addOneTwo(20), 23);
  test.strictSame(addTwoThree(10), 15);
  test.strictSame(addTwoThree(20), 25);
});

metatests.testSync('curry of identity', test => {
  const id = x => x;
  const idCurry = common.curry(id);
  test.strictSame(idCurry(10), 10);
  test.strictSame(idCurry(20), 20);

  test.strictSame(common.curry(id, 10), 10);
});

metatests.testSync('curry of unit', test => {
  const unit = () => 42;
  const unitCurry = common.curry(unit);
  test.strictSame(unitCurry(), 42);
});

metatests.testSync('redundant args must be ignored', test => {
  const add = (x, y) => x + y;
  const addCurry = common.curry(add);
  test.strictSame(addCurry(1, 2, 4), 3);
  test.strictSame(common.curry(add, 1, 2, 4), 3);

  const sum = (x, y, z) => x + y + z;
  const sumCurry = common.curry(sum);
  test.strictSame(sumCurry(1, 2, 3, 4, 5), 6);
  test.strictSame(common.curry(sum, 1, 2, 3, 4, 5), 6);
});

metatests.test('curryN', test => {
  const sum = (x, y, z) => x + y + z;
  const sumC = common.curryN(sum, 2, 1);
  const sumC2 = sumC(2);
  const res = sumC2(3);
  test.strictSame(res, 6);
  test.end();
});

metatests.test('curryTwice', test => {
  const sum = (x, y) => x + y;
  test.strictSame(common.curryTwice(sum)(1)(2), 3);
  test.end();
});

metatests.test('applyArgs', test => {
  const argsFn = common.applyArgs(1, 2, 3);
  const fn = test.mustCall((a, b, c) => {
    test.strictSame([a, b, c], [1, 2, 3]);
    return a + b + c;
  });
  test.strictSame(argsFn(fn), 6);
  test.end();
});

metatests.test('either', test => {
  const fnEither = common.either(x => x * 2);

  const res = fnEither(1, 2);

  test.strictSame(res, 2);
  test.end();
});

metatests.test('either with one error and one success', test => {
  const fnError = new Error('either with error');
  const fn = x => {
    if (x === 1) {
      throw fnError;
    } else {
      return x * 2;
    }
  };
  const fnEither = common.either(fn);

  const res = fnEither(1, 2);

  test.strictSame(res, 4);
  test.end();
});

metatests.test('either with all errors', test => {
  const fnError1 = new Error('either with error 1');
  const fnError2 = new Error('either with error 2');
  const fn = x => {
    if (x === 1) {
      throw fnError1;
    } else {
      throw fnError2;
    }
  };
  const fnEither = common.either(fn);

  test.throws(fnEither.bind(null, 1, 2), fnError2);
  test.end();
});

metatests.test('restLeft', test => {
  const expectedArgs = [3, 4, 5];
  const expectedArg1 = 1;
  const expectedArg2 = 2;
  const expectedCallbackArgs = [6, 7, 8];
  const af = common.restLeft((args, arg1, arg2, callback) => {
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
