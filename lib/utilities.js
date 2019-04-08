'use strict';

const { basename } = require('path');

const { between } = require('./strings');

// Wrap method to mark it as deprecated
//   fn - <Function>
// Returns: <Function>, wrapped with deprecation warning
//   args - <Array>, arguments to be passed to wrapped function
const deprecate = fn => {
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

// Wrap new method to mark old alias as deprecated
//   fn - <Function>
// Returns: <Function>, wrapped with deprecation warning
//   args - <Array>, arguments to be passed to wrapped function
const alias = fn => {
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

// Make function raise-safe
//   fn - <Function>
// Returns: <Function>, function(...args), wrapped with try/catch interception
//   args - <Array>, arguments to be passed to wrapped function
const safe = fn => (...args) => {
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
  return '';
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
