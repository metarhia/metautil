'use strict';

const metatests = require('metatests');
const { toBool, timeout, delay, timeoutify } = require('..');

metatests.test('Async: toBool', async (test) => {
  const success = await Promise.resolve('success').then(...toBool);
  test.strictSame(success, true);
  const rejected = await Promise.reject(new Error('Ups')).then(...toBool);
  test.strictSame(rejected, false);
  test.end();
});

metatests.test('Async: Abortable timeout', async (test) => {
  try {
    await timeout(10);
    test.error(new Error('Should not be executed'));
  } catch (err) {
    test.strictSame(err.code, 'ETIMEOUT');
    test.strictSame(err.message, 'Timeout of 10ms reached');
  }
  const ac = new AbortController();
  setTimeout(() => {
    ac.abort();
  }, 10);
  try {
    await timeout(100, ac.signal);
    test.error(new Error('Should not be executed'));
  } catch (err) {
    test.strictSame(err.message, 'Timeout aborted');
    test.end();
  }
});

metatests.test('Async: Abortable delay', async (test) => {
  try {
    const res = await delay(10);
    test.strictSame(res, undefined);
  } catch {
    test.error(new Error('Should not be executed'));
  }
  const ac = new AbortController();
  setTimeout(() => {
    ac.abort();
  }, 10);
  try {
    await delay(100, ac.signal);
    test.error(new Error('Should not be executed'));
  } catch (err) {
    test.strictSame(err.message, 'Delay aborted');
    test.end();
  }
});

metatests.test('Async: timeoutify', async (test) => {
  try {
    const request = delay(1000);
    await timeoutify(request, 10);
    test.error(new Error('Should not be executed'));
  } catch (err) {
    test.strictSame(err.code, 'ETIMEOUT');
    test.strictSame(err.message, 'Timeout of 10ms reached');
  }
  try {
    const request = delay(10);
    const response = await timeoutify(request, 1000);
    test.strictSame(response, undefined);
    test.end();
  } catch {
    test.error(new Error('Should not be executed'));
  }
});
