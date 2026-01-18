'use strict';

const init = require('eslint-config-metarhia');
init[0].ignores.push('metautil.iife.js');

module.exports = [
  ...init,
  {
    files: ['metautil.mjs'],
    languageOptions: {
      sourceType: 'module',
    },
  },
];
