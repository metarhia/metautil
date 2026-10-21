'use strict';

const { Error } = require('./error.js');

const toBool = [() => true, () => false];

const timeoutError = (msec) =>
  new Error(`Timeout of ${String(msec)}ms reached`, 'ETIMEOUT');

const abortable = (msec, signal, label, onElapsed) =>
  new Promise((resolve, reject) => {
    const message = `${label} aborted`;
    if (signal !== null && signal.aborted) {
      return void reject(new Error(message, { name: 'AbortError' }));
    }
    let timer = null;
    const onAbort = () => {
      clearTimeout(timer);
      reject(new Error(message, { name: 'AbortError' }));
    };
    timer = setTimeout(() => {
      if (signal !== null) signal.removeEventListener('abort', onAbort);
      onElapsed(resolve, reject);
    }, msec);
    if (signal !== null) {
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });

const timeout = (msec, signal = null) =>
  abortable(msec, signal, 'Timeout', (resolve, reject) => {
    reject(timeoutError(msec));
  });

const delay = (msec, signal = null) =>
  abortable(msec, signal, 'Delay', (resolve) => {
    resolve();
  });

const timeoutify = (promise, msec) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(timeoutError(msec));
    }, msec);
    promise.then(resolve, reject).finally(() => {
      clearTimeout(timer);
    });
  });

const createDeferred = (fn) => ({ fn, timer: null, args: null });

const invokeDeferred = (deferred) => {
  deferred.fn(...deferred.args);
  deferred.args = null;
};

const deferredControls = (deferred, wrapped) => ({
  fn: wrapped,
  cancel: () => {
    clearTimeout(deferred.timer);
    deferred.timer = null;
    deferred.args = null;
  },
  flush: () => {
    if (deferred.timer === null) return;
    clearTimeout(deferred.timer);
    deferred.timer = null;
    if (deferred.args !== null) invokeDeferred(deferred);
  },
});

const throttle = (fn, msec) => {
  const deferred = createDeferred(fn);

  const tick = () => {
    deferred.timer = null;
    if (deferred.args === null) return;
    invokeDeferred(deferred);
    deferred.timer = setTimeout(tick, msec);
  };

  const wrapped = (...args) => {
    deferred.args = args;
    if (deferred.timer !== null) return;
    invokeDeferred(deferred);
    deferred.timer = setTimeout(tick, msec);
  };

  return deferredControls(deferred, wrapped);
};

const debounce = (fn, msec) => {
  const deferred = createDeferred(fn);

  const elapsed = () => {
    deferred.timer = null;
    invokeDeferred(deferred);
  };

  const wrapped = (...args) => {
    deferred.args = args;
    clearTimeout(deferred.timer);
    deferred.timer = setTimeout(elapsed, msec);
  };

  return deferredControls(deferred, wrapped);
};

module.exports = {
  toBool,
  timeout,
  delay,
  timeoutify,
  throttle,
  debounce,
};
