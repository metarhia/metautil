'use strict';

const metatests = require('metatests');
const { timeout, createAbortController } = require('..');

metatests.test('Abortable timeout', async (test) => {
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
