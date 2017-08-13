'use strict';

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

module.exports = {
  deprecate,
};
