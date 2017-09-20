'use strict';

const override = (
  // Override method: save old to `fn.inherited`
  obj, // object, containing method to override
  fn // function, name will be used to find method
  // Hint: Previous function will be accessible by obj.fnName.inherited
) => {
  fn.inherited = obj[fn.name];
  obj[fn.name] = fn;
};

const mixin = (
  // Mixin for ES6 classes without overriding existing methods
  target, // object, mixin to target
  source // object, source methods
) => {
  const methods = Object.getOwnPropertyNames(source);
  const mix = {};
  let method;
  for (method of methods) {
    if (!target[method]) {
      mix[method] = source[method];
    }
  }
  Object.assign(target, mix);
};

module.exports = {
  override,
  mixin,
};
