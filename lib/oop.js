'use strict';

const { between } = require('./utilities.js');

const getSignature = (method) => {
  const src = method.toString();
  const signature = between(src, '({', '})');
  if (signature === '') return [];
  return signature.split(',').map((s) => s.trim());
};

module.exports = { getSignature };
