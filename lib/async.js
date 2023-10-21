'use strict';

const { Error } = require('./error.js');

const toBool = [() => true, () => false];

const timeout = (msec, signal = null) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout of ${msec}ms reached`, 'ETIMEOUT'));
    }, msec);
    if (!signal) return;
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new Error('Timeout aborted'));
    });
  });

const delay = (msec, signal = null) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, msec);
    if (!signal) return;
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new Error('Delay aborted'));
    });
  });

const timeoutify = (promise, msec) =>
  new Promise((resolve, reject) => {
    let timer = setTimeout(() => {
      timer = null;
      reject(new Error(`Timeout of ${msec}ms reached`, 'ETIMEOUT'));
    }, msec);
    promise.then(
      (result) => {
        if (!timer) return;
        clearTimeout(timer);
        resolve(result);
      },
      (error) => {
        if (!timer) return;
        clearTimeout(timer);
        reject(error);
      },
    );
  });

module.exports = { toBool, timeout, delay, timeoutify };
