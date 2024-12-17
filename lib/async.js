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

const callbackify =
  (fn) =>
  (...args) => {
    const callback = args.pop();
    fn(...args)
      .then((value) => {
        callback(null, value);
      })
      .catch((reason) => {
        callback(reason);
      });
  };

const asyncify =
  (fn) =>
  (...args) => {
    const callback = args.pop();
    setTimeout(() => {
      let result;
      try {
        result = fn(...args);
      } catch (error) {
        return void callback(error);
      }
      callback(null, result);
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
