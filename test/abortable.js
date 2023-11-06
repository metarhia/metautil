'use strict';

const metatests = require('metatests');
const { Abortable, delay } = require('..');

const taskWithTimeout = async (test, taskDelay, timeout, abortable = null) => {
  if (!abortable) test.error(new Error('Should not be executed'));
  if (taskDelay <= timeout) test.error(new Error('Should not be executed'));
  await delay(taskDelay);
  test.strictSame(abortable.aborted, true);
  try {
    abortable.throwIfAborted();
  } catch (err) {
    test.strictSame(err.message, `Task aborted after ${timeout}ms`);
    return;
  }
  test.error(new Error('Should not be executed'));
  await delay(200);
};

const taskWithAbort = async (test, taskDelay, abortable = null) => {
  if (!abortable) test.error(new Error('Should not be executed'));
  await delay(taskDelay);
  test.strictSame(abortable.aborted, false);
  abortable.abort('Manual abort');
  test.strictSame(abortable.aborted, true);
  try {
    abortable.throwIfAborted();
  } catch (err) {
    test.strictSame(err.message, 'Manual abort');
    return;
  }
  test.error(new Error('Should not be executed'));
  await delay(200);
};

metatests.test('Abortable: simple timeout abort', async (test) => {
  const abortable = new Abortable(5, true);
  abortable.on('aborted', (reason) => {
    test.strictSame(reason, abortable.reason);
  });
  try {
    await abortable.run(delay, 10, null);
    test.error(new Error('Should not be executed'));
  } catch (err) {
    test.strictSame(err.message, 'Task aborted after 5ms');
    test.end();
  }
});

metatests.test(
  'Abortable: resetTimeout after run (throwOnAborted)',
  async (test) => {
    const taskDelay = 10;
    const timeout = 5;
    const throwOnAborted = true;
    const abortable = new Abortable(60000, throwOnAborted);
    abortable.on('aborted', (reason) => {
      test.strictSame(reason, abortable.reason);
      test.strictSame(reason?.message, `Task aborted after ${timeout}ms`);
    });
    abortable.on('timeout', () => {
      const { message } = abortable.reason;
      test.strictSame(message, `Task aborted after ${timeout}ms`);
    });
    abortable.run(taskWithTimeout, test, taskDelay, timeout).catch((err) => {
      test.strictSame(err, abortable.reason);
      test.strictSame(err.message, `Task aborted after ${timeout}ms`);
    });
    abortable.resetTimeout(timeout);
    await delay(250);
    test.end();
  },
);

metatests.test(
  'Abortable: resetTimeout after run (!throwOnAborted)',
  async (test) => {
    const taskDelay = 10;
    const timeout = 5;
    const abortable = new Abortable();
    abortable.on('aborted', (reason) => {
      test.strictSame(reason, abortable.reason);
      test.strictSame(reason?.message, `Task aborted after ${timeout}ms`);
    });
    abortable.on('timeout', () => {
      const { message } = abortable.reason;
      test.strictSame(message, `Task aborted after ${timeout}ms`);
    });
    abortable.run(taskWithTimeout, test, taskDelay, timeout).catch(() => {
      test.error(new Error('Should not be executed'));
    });
    abortable.resetTimeout(timeout);
    await delay(250);
    test.end();
  },
);

metatests.test(
  'Abortable: manual task abort (!throwOnAborted)',
  async (test) => {
    const taskDelay = 10;
    const throwOnAborted = false;
    const abortable = new Abortable(60000, throwOnAborted);
    abortable.on('aborted', (reason) => {
      test.strictSame(reason, abortable.reason);
      test.strictSame(reason?.message, 'Manual abort');
    });
    abortable.on('timeout', () => {
      test.error(new Error('Should not be executed'));
    });
    await abortable.run(taskWithAbort, test, taskDelay).catch(() => {
      test.error(new Error('Should not be executed'));
    });
    test.end();
  },
);
