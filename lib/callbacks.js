'use strict';

const falseness = (
  // Empy function
  // Returns: Boolean always false
) => false;

const trueness = (
  // Empy function
  // Returns: Boolean always true
) => true;

const emptiness = (
  // Empy function
  // Returns: always undefined
) => {};

const nop = (
  // Empy asynchronous callback-last single-argument function
  callback // callback to be called with (null)
) => {
  callback(null);
};

const noop = (
  // Empy asynchronous callback-last double-argument function
  empty, // incoming value to be ignored
  callback // callback to be called with (null, null)
) => {
  callback(null, null);
};

const cb = (
  // Wrap callback: call once, not null
  callback // function (optional)
  // Returns: wrapped callback
) => {
  if (!callback) return emptiness;
  let finished = false;
  const wrap = (...args) => {
    if (finished) return;
    finished = true;
    callback(...args);
  };
  return wrap;
};

const cbExtract = (
  // Exctracts callback and wraps it with common.cb
  // callback is last argument if it's function
  // otherwise it's common.falseness
  args // arguments
  // Returns: wrapped callback
) => {
  const callback = args[args.length - 1];
  if (typeof(callback) !== 'function') return emptiness;

  args.pop();
  return cb(callback);
};

module.exports = {
  falseness,
  trueness,
  emptiness,
  nop,
  noop,
  cb,
  cbExtract,
};
