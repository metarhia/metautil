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

const throttle = (fn, interval, ...presetArgs) => {
  if (typeof interval !== 'number' || interval < 0) {
    throw new Error('Interval must be greater then 0');
  }
  let lastTime = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastTime < interval) return;
    try {
      fn(...presetArgs, ...args);
    } finally {
      lastTime = now;
    }
  };
};

const debounce = (fn, delay, ...args) => {
  let timer = null;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delay);
  };
};

const callbackify =
  (asyncFn) =>
  (...args) => {
    const callback = args.pop();
    if (typeof callback !== 'function' || callback.length !== 2) {
      throw new Error('Last argument should be a function with 2 parameters');
    }
    asyncFn(...args)
      .then((res) => callback(null, res))
      .catch((err) => callback(err));
  };

const asyncify =
  (fn) =>
  (...args) => {
    const callback = args.pop();
    setTimeout(() => {
      try {
        const result = fn(...args);
        callback(null, result);
      } catch (error) {
        callback(error);
      }
    }, 0);
  };

const promisify =
  (fn) =>
  (...args) =>
    new Promise((resolve, reject) =>
      fn(...args, (err, data) => (err ? reject(err) : resolve(data))),
    );

module.exports = {
  toBool,
  timeout,
  delay,
  timeoutify,
  throttle,
  debounce,
  callbackify,
  asyncify,
  promisify,
};
