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
  // Extract callback function
  // It's unsafe: may return null, allow multiple calls
  args // array, arguments
  // Returns: function, callback or null
  // Hint: previous name: `common.cbUnsafe` (deprecated)
  // Hint: another alias: `common.extractCallback` (deprecated)
) => {
  const callback = last(args);
  if (typeof(callback) === 'function') return args.pop();
  return null;
};

const safeCallback = (
  // Exctracts callback and return common.emptiness if no callback
  args // array, arguments
  // Returns: function, wrapped callback
  // Hint: previous name: `cbExtract` (deprecated)
) => {
  const callback = last(args);
  if (typeof(callback) === 'function') return args.pop();
  return emptiness;
};

const requiredCallback = (
  // Exctracts callback and throw if no callback
  args // array, arguments
  // Returns: function
) => {
  const callback = last(args);
  if (typeof(callback) === 'function') return args.pop();
  throw new TypeError('No callback provided');
};

const onceCallback = (
  // Exctracts callback and make it safe
  // Wrap collback with once()
  // and return common.emptiness if no callback
  args // array, arguments
  // Returns: function
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

  requiredCallback,
  onceCallback,
};
