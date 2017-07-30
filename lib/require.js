'use strict';

const { either } = require('./fp');

const requireEither = either(require);

const safeRequire = (
  // Requires module not raising exception
  moduleName // String
  // Returns: tuple [err, module]
) => {
  try {
    return [null, require(moduleName)];
  } catch (err) {
    return [err, null];
  }
};

module.exports = {
  requireEither,
  safeRequire,
};
