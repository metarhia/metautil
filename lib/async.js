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

module.exports = { toBool, timeout, delay, timeoutify };
