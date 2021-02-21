'use strict';

const metatests = require('metatests');
const { timeout, createAbortController } = require('..');

metatests.test('Abortable timeout', async (test) => {
  await timeout(10);
  const ac = createAbortController();
  setTimeout(() => {
    ac.abort();
  }, 10);
  try {
    await timeout(100, ac.signal);
    test.error(new Error('Should throw'));
  } catch {
    test.end();
  }
});
