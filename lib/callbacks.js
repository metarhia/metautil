'use strict';

const { last } = require('./array');
const { alias } = require('./utilities');

const falseness = (
  // Empy function
  // Returns: boolean, always false
) => false;

const trueness = (
  // Empy function
  // Returns: boolean, always true
) => true;

const emptiness = (
  // Empy function
  // Returns: always undefined
) => {};

const nop = (
  // Empy asynchronous callback-last single-argument function
  callback // function, callback to be called with (null)
) => {
  callback(null);
};

const noop = (
  // Empy asynchronous callback-last double-argument function
  empty, // incoming value to be ignored
  callback // function, callback to be called with (null, null)
) => {
  callback(null, null);
};

const once = (
  // Wrap function: call once, not null
  fn // function (optional)
  // Returns: function, wrapped callback
) => {
  if (!fn) return emptiness;
  let finished = false;
  const wrap = (...args) => {
    if (finished) return;
    finished = true;
    fn(...args);
  };
  return wrap;
};

const unsafeCallback = (
  // Extract callback function (unsafe: maybe null and multiple calls)
  args // array, arguments
  // Returns: function, callback or null
) => {
  const callback = last(args);
  if (typeof(callback) === 'function') return args.pop();
  return null;
};

const safeCallback = (
  // Exctracts callback and wraps it with common.cb
  // callback is last argument otherwise returns common.falseness
  args // array, arguments
  // Returns: function, wrapped callback
) => {
  const callback = last(args);
  if (typeof(callback) === 'function') return once(args.pop());
  return emptiness;
};

module.exports = {
  falseness,
  trueness,
  emptiness,
  nop,
  noop,

  once,
  cb: alias(once),

  unsafeCallback,
  extractCallback: alias(unsafeCallback),
  cbUnsafe: alias(unsafeCallback),

  safeCallback,
  cbExtract: alias(safeCallback),
};
