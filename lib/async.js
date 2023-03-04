'use strict';

const { EventEmitter } = require('node:events');

const polyfillAbortController = () => {
  const emitter = new EventEmitter();
  const signal = {
    emitter,
    onabort: null,
    aborted: false,
    reason: undefined,
    removeEventListener(name, callback) {
      emitter.removeListener(name, callback);
    },
    addEventListener(name, callback) {
      emitter.on(name, callback);
    },
  };
  return {
    signal,
    abort(reason) {
      if (signal.aborted) return;
      signal.aborted = true;
      signal.reason = reason ? reason : new Error('AbortError');
      const event = { type: 'abort', target: signal };
      if (signal.onabort) signal.onabort(event);
      emitter.emit(event.type, event);
    },
  };
};

const nativeAbortController = () => new AbortController();

const createAbortController = global.AbortController
  ? nativeAbortController
  : polyfillAbortController;

const timeout = (msec, signal = null) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Timeout reached'));
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

module.exports = {
  createAbortController,
  timeout,
  delay,
};
