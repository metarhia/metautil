'use strict';

const { last } = require('./array');

// Empty function
// Returns: <boolean>, always `false`
const falseness = () => false;

// Empty function
// Returns: <boolean>, always `true`
const trueness = () => true;

// Empty function
const emptiness = () => {};

// Empty asynchronous callback-last single-argument function
//   callback - <Function>, callback to be called with (null)
const nop = callback => {
  callback(null);
};

// Empty asynchronous callback-last double-argument function
//   empty - <any>, incoming value to be ignored
//   callback - <Function>, callback to be called with (null, null)
const noop = (empty, callback) => {
  callback(null, null);
};

// Wrap function: call once, not null
// Signature: [fn]
//   fn - <Function>, (optional)
// Returns: <Function>, function(...args) wrapped callback
//   args - <Array>
const once = fn => {
  if (!fn) return emptiness;
  let finished = false;
  const wrap = (...args) => {
    if (finished) return;
    finished = true;
    fn(...args);
  };
  return wrap;
};

// Extract callback function
// It's unsafe: may return null, allows multiple calls
//   args - <Array>, arguments
// Returns: <Function> | <null>, callback if any
const unsafeCallback = args => {
  const callback = last(args);
  if (typeof callback === 'function') return args.pop();
  return null;
};

// Extract callback
//   args - <Array>, arguments
// Returns: <Function>, callback or common.emptiness if there is no callback
const safeCallback = args => {
  const callback = last(args);
  if (typeof callback === 'function') return args.pop();
  return emptiness;
};

// Extract callback
//   args - <Array>, arguments
// Returns: <Function>, extracted callback
// Throws: <TypeError>, if there is no callback
const requiredCallback = args => {
  const callback = last(args);
  if (typeof callback === 'function') return args.pop();
  throw new TypeError('No callback provided');
};

// Extract callback and make it safe
// Wrap callback with once()
//   args - <Array>, arguments
// Returns: <Function>, callback or common.emptiness if there is no callback
const onceCallback = args => {
  const callback = last(args);
  if (typeof callback === 'function') return once(args.pop());
  return emptiness;
};

// Check function
//   fn - <Function>
// Returns: <Function> | <null>, function or null if fn is not a function
const unsafeFunction = fn => (typeof fn === 'function' ? fn : null);

// Check function and make it safe
//   fn - <Function>
// Returns: <Function>, function or `common.emptiness` if fn is not a function
const safeFunction = fn => (typeof fn === 'function' ? fn : emptiness);

// Identity function
//   x - <any>, incoming value which will be returned
// Returns: <any>, incoming value
const id = x => x;

// Async identity function
//   x - <any>, incoming value which will be returned into the callback
//   callback - <Function>, callback to be called with first argument
//     err - <null>
//     data - <any>
const asyncId = (x, callback) => {
  process.nextTick(callback, null, x);
};

module.exports = {
  falseness,
  trueness,
  emptiness,
  nop,
  noop,

  once,
  unsafeCallback,
  safeCallback,

  requiredCallback,
  onceCallback,

  safeFunction,
  unsafeFunction,

  id,
  asyncId,
};
