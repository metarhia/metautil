'use strict';

const metatests = require('metatests');
const { Future, futurify } = require('..');

metatests.test('Future: executor', async (test) => {
  const future = new Future((resolve) => resolve(24));
  const future2 = future.map((value) => value * 2);
  future.fork(
    (value) => test.strictSame(value, 24),
    (error) => test.error(error),
  );
  future2.fork(
    (value) => test.strictSame(value, 48),
    (error) => test.error(error),
  );
  test.end();
});

metatests.test('Future: of', async (test) => {
  const future = new Future((resolve) => resolve(24));
  future.fork(
    (value) => test.strictSame(value, 24),
    (error) => test.error(error),
  );
  test.end();
});

metatests.test('Future: map', async (test) => {
  const future = Future.of(24)
    .map((value) => value * 2)
    .map((value) => value + 1);
  future.fork(
    (value) => test.strictSame(value, 49),
    (error) => test.error(error),
  );

  test.end();
});

metatests.test('Future: chain', async (test) => {
  const future = Future.of(24)
    .chain((value) => Future.of(value * 2))
    .chain((value) => Future.of(value + 1));
  future.fork(
    (value) => test.strictSame(value, 49),
    (error) => test.error(error),
  );

  test.end();
});

metatests.test('Future: toPromise', async (test) => {
  const future = new Future((resolve) => {
    setTimeout(() => {
      resolve(24);
    }, 50);
  });
  const futurePromise = future.toPromise();
  const res = await futurePromise;
  test.strictSame(res, 24);
  test.end();
});

metatests.test('Future: toThenable', async (test) => {
  const future = new Future((resolve) => {
    setTimeout(() => {
      resolve(24);
    }, 50);
  });
  const thenable = future.toThenable();
  thenable.then((value, err) => {
    if (err) return void test.error(err);
    test.strictSame(value, 24);
  });
  test.end();
});

metatests.test('Future: futurify', async (test) => {
  const asyncFunction = (value, callback) => {
    setTimeout(() => {
      if (value > 0) callback(null, value * 2);
      else callback(new Error('Negative value'));
    }, 50);
  };
  const futureFunction = futurify(asyncFunction);
  const future = futureFunction(24);
  future.fork(
    (value) => test.strictSame(value, 48),
    (error) => test.error(error),
  );
  const rejectedFuture = futureFunction(-1);
  rejectedFuture.fork(
    () => test.error(new Error('Should not be executed')),
    (error) => test.strictSame(error.message, 'Negative value'),
  );

  test.end();
});
