'use strict';

const { EventEmitter } = require('events');

const createAbortController = () => {
  const signal = new EventEmitter();
  const abort = () => {
    signal.emit('abort');
  };
  return { abort, signal };
};

const timeout = (msec, signal = null) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Timeout reached'));
    }, msec);
    if (!signal) return;
    signal.on('abort', () => {
      clearTimeout(timer);
      reject(new Error('Timeout aborted'));
    });
  });

const delay = (msec, signal = null) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, msec);
    if (!signal) return;
    signal.on('abort', () => {
      clearTimeout(timer);
      reject(new Error('Delay aborted'));
    });
  });

module.exports = {
  createAbortController,
  timeout,
  delay,
};
