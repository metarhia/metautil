'use strict';

const { Error } = require('./error.js');

const toBool = [() => true, () => false];

const timeout = (msec, signal = null) =>
  new Promise((resolve, reject) => {
    const alreadyAborted = signal !== null && signal.aborted;
    if (alreadyAborted) {
      return void reject(new Error('Timeout aborted', { name: 'AbortError' }));
    }
    let timer = null;
    const onAbort = () => {
      clearTimeout(timer);
      reject(new Error('Timeout aborted', { name: 'AbortError' }));
    };
    timer = setTimeout(() => {
      if (signal !== null) signal.removeEventListener('abort', onAbort);
      reject(new Error(`Timeout of ${msec}ms reached`, 'ETIMEOUT'));
    }, msec);
    if (signal !== null) {
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });

const delay = (msec, signal = null) =>
  new Promise((resolve, reject) => {
    const alreadyAborted = signal !== null && signal.aborted;
    if (alreadyAborted) {
      return void reject(new Error('Delay aborted', { name: 'AbortError' }));
    }
    let timer = null;
    const onAbort = () => {
      clearTimeout(timer);
      reject(new Error('Delay aborted', { name: 'AbortError' }));
    };
    timer = setTimeout(() => {
      if (signal !== null) signal.removeEventListener('abort', onAbort);
      resolve();
    }, msec);
    if (signal !== null) {
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });

const timeoutify = (promise, msec) =>
  new Promise((resolve, reject) => {
    let timer = setTimeout(() => {
      timer = null;
      reject(new Error(`Timeout of ${msec}ms reached`, 'ETIMEOUT'));
    }, msec);
    promise.then(resolve, reject).finally(() => {
      if (timer !== null) clearTimeout(timer);
    });
  });

const throttle = (fn, msec) => {
  let timer = null;
  let args = null;

  const invoke = () => {
    fn(...args);
    args = null;
  };

  const wrapped = (...next) => {
    args = next;
    if (timer !== null) return;
    invoke();
    const tick = () => {
      timer = null;
      if (args === null) return;
      invoke();
      timer = setTimeout(tick, msec);
    };
    timer = setTimeout(tick, msec);
  };

  const cancel = () => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    args = null;
  };

  const flush = () => {
    if (timer === null) return;
    clearTimeout(timer);
    timer = null;
    if (args !== null) invoke();
  };

  return { fn: wrapped, cancel, flush };
};

const debounce = (fn, msec) => {
  let timer = null;
  let args = null;

  const invoke = () => {
    fn(...args);
    args = null;
  };

  const wrapped = (...next) => {
    args = next;
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      invoke();
    }, msec);
  };

  const cancel = () => {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    args = null;
  };

  const flush = () => {
    if (timer === null) return;
    clearTimeout(timer);
    timer = null;
    if (args !== null) invoke();
  };

  return { fn: wrapped, cancel, flush };
};

module.exports = {
  toBool,
  timeout,
  delay,
  timeoutify,
  throttle,
  debounce,
};
