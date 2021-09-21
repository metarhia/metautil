'use strict';

const metatests = require('metatests');
const { timeout, delay, createAbortController } = require('..');

metatests.test('Async: Abortable timeout', async (test) => {
  try {
    await timeout(10);
    test.error(new Error('Should not be executed'));
  } catch (err) {
    test.strictSame(err.message, 'Timeout reached');
  }
  const ac = createAbortController();
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
  } catch (err) {
    test.error(new Error('Should not be executed'));
  }
  const ac = createAbortController();
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
