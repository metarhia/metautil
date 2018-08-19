'use strict';

const { basename } = require('path');

const { between } = require('./strings');

const deprecate = (
  // Wrap method to mark it as deprecated
  fn // function (optional)
  // Returns: function, wrapped with deprecation warning
) => {
  let warned = false;
  const wrap = (...args) => {
    if (!warned) {
      const err = new Error(`Warning: method ${fn.name} is deprecated`);
      console.warn(err);
      warned = true;
    }
    return fn(...args);
  };
  return wrap;
};

const alias = (
  // Wrap new method to mark old alias as deprecated
  fn // function (optional)
  // Returns: function, wrapped with deprecation warning
) => {
  let warned = false;
  const wrap = (...args) => {
    if (!warned) {
      const err = new Error();
      const name = between(err.stack, '[', ']');
      err.message = `Warning: use ${fn.name} instead of deprecated ${name}`;
      err.stack = err.stack.replace('Error', err.message);
      console.warn(err);
      warned = true;
    }
    return fn(...args);
  };
  return wrap;
};

const safe = (
  // Make function raise-safe
  fn // function
  // Returns: function, wrapped with try/catch interception
) => (...args) => {
  try {
    return [null, fn(...args)];
  } catch (err) {
    return [err, null];
  }
};

const nodeModuleMatch = /internal[/\\]modules[/\\](cjs|esm)[/\\]/;

const callerFilepath = (depth = 0, stack = null) => {
  if (!stack) {
    const origLimit = Error.stackTraceLimit;
    Error.stackTraceLimit = 50;
    stack = new Error().stack;
    Error.stackTraceLimit = origLimit;
  }
  // remove first 'Error' line and this function
  stack = stack.split('\n').slice(2);
  if (depth > stack.length - 1) depth = stack.length - 1;
  if (depth > 0) stack = stack.slice(depth);

  let frame = null;
  do {
    frame = stack.shift();
  } while (frame && nodeModuleMatch.test(frame));

  if (frame) {
    const start = frame.indexOf('(');
    const end = frame.indexOf(':', start + 1);
    return frame.substring(start + 1, end);
  }
};

const callerFilename = (depth = 0, stack = null) =>
  basename(callerFilepath(depth + 1, stack) || '');

module.exports = {
  deprecate,
  alias,
  safe,
  callerFilename,
  callerFilepath,
};
