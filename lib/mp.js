'use strict';

// List method names
//   iface - <Object>, to be introspected
// Returns: <string[]>, method names
const methods = iface => {
  const names = [];
  for (const name in iface) {
    if (typeof iface[name] === 'function') {
      names.push(name);
    }
  }
  return names;
};

// List property names
//   iface - <Object>, to be introspected
// Returns: <string[]>, property names
const properties = iface => {
  const names = [];
  for (const name in iface) {
    if (typeof iface[name] !== 'function') {
      names.push(name);
    }
  }
  return names;
};

module.exports = {
  methods,
  properties,
};
