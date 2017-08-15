'use strict';

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

module.exports = {
  deprecate,
  alias,
  safe,
};
