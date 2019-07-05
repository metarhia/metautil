'use strict';

const { basename } = require('path');

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
    const start = frame.indexOf('(') + 1;
    const lastColon = frame.lastIndexOf(':');
    const end = frame.lastIndexOf(':', lastColon - 1);
    return frame.substring(start, end);
  }
  return '';
};

const callerFilename = (depth = 0, stack = null) =>
  basename(callerFilepath(depth + 1, stack));

module.exports = {
  safe,
  callerFilename,
  callerFilepath,
};
