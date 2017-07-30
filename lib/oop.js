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

module.exports = {
  override,
};
