'use strict';

const toBool = [() => true, () => false];

const timeout = (msec, signal = null) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout of ${msec}ms reached`));
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

module.exports = { toBool, timeout, delay };
