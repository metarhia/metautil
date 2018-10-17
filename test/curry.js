'use strict';

const metatests = require('metatests');
const common = require('..');

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
