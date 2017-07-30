'use strict';

const override = (
  // Override method: save old to `fn.inherited`
  obj, // object containing method to override
  fn // function, name will be used to find method
  // Previous function will be accessible by obj.fnName.inherited
) => {
  fn.inherited = obj[fn.name];
  obj[fn.name] = fn;
};

const mixin = (
  // Mixin for ES6 classes without overriding existing methods
  target, // mixin to target
  source // source methods
) => {
  Object.getOwnPropertyNames(source).forEach((property) => {
    if (!target[property]) {
      target[property] = source[property];
    }
  });
};

module.exports = {
  override,
  mixin,
};
