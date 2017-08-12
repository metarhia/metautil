'use strict';

const methods = (
  // List method names
  iface // object, to be introspected
  // Returns: array of string, method names
) => {
  const names = [];
  let name;
  for (name in iface) {
    if (typeof(iface[name]) === 'function') {
      names.push(name);
    }
  }
  return names;
};

const properties = (
  // List property names
  iface // object, to be introspected
  // Returns: array of string, property names
) => {
  const names = [];
  let name;
  for (name in iface) {
    if (typeof(iface[name]) !== 'function') {
      names.push(name);
    }
  }
  return names;
};

module.exports = {
  methods,
  properties,
};
