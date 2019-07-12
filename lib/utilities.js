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

const captureMaxStack = () => {
  const oldLimit = Error.stackTraceLimit;
  Error.stackTraceLimit = Infinity;
  const stack = new Error().stack;
  Error.stackTraceLimit = oldLimit;
  return stack;
};

const nodeModuleMatch = /internal[/\\]modules[/\\](cjs|esm)[/\\]/;

// Try to detect the filepath of a caller of this function.
// Signature: depth = 0, stack = null
//   depth <number> | <RegExp> initial stack slice or filter regular expression,
//       0 by default.
//   stack <string> stack string, optional
const callerFilepath = (depth = 0, stack = null) => {
  if (!stack) {
    // remove first 'Error' line, captureMaxStack and this function
    stack = captureMaxStack()
      .split('\n')
      .slice(3);
  } else {
    // remove first 'Error' line and this function
    stack = stack.split('\n').slice(2);
  }

  const filters = [nodeModuleMatch];
  if (typeof depth === 'number') {
    if (depth > stack.length - 1) depth = stack.length - 1;
    if (depth > 0) stack = stack.slice(depth);
  } else {
    filters.push(depth);
  }

  const testFilters = frame => filters.some(f => f.test(frame));
  let frame = null;
  do {
    frame = stack.shift();
  } while (frame && testFilters(frame));

  if (frame) {
    const start = frame.indexOf('(') + 1;
    const lastColon = frame.lastIndexOf(':');
    const end = frame.lastIndexOf(':', lastColon - 1);
    return frame.substring(start, end);
  }
  return '';
};

const callerFilename = (depth = 0, stack = null) =>
  basename(
    callerFilepath(typeof depth === 'number' ? depth + 1 : depth, stack)
  );

module.exports = {
  safe,
  captureMaxStack,
  callerFilename,
  callerFilepath,
};
