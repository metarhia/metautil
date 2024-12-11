'use strict';

const { Error } = require('./error.js');

const toBool = [() => true, () => false];

const timeout = (msec, signal = null) =>
  new Promise((resolve, reject) => {
    if (signal !== null && signal.aborted) {
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
    if (signal !== null && signal.aborted) {
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

const throttle = (timeout, fn, ...args) => {
  let timer;
  let wait = false;

  const execute = args
    ? (...pars) => (pars ? fn(...args, ...pars) : fn(...args))
    : (...pars) => (pars ? fn(...pars) : fn());

  const delayed = (...pars) => {
    timer = undefined;
    if (wait) execute(...pars);
  };

  const throttled = (...pars) => {
    if (!timer) {
      timer = setTimeout(delayed, timeout, ...pars);
      wait = false;
      execute(...pars);
    }
    wait = true;
  };

  return throttled;
};

const debounce = (timeout, fn, ...args) => {
  let timer;

  const debounced = () => (args ? fn(...args) : fn());

  const wrapped = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(debounced, timeout);
  };

  return wrapped;
};

module.exports = { toBool, timeout, delay, timeoutify, throttle, debounce };
