'use strict';

const init = require('eslint-config-metarhia');

module.exports = [
  ...init,
  {
    ignores: ['examples/**'],
  },
  {
    files: ['metautil.mjs'],
    languageOptions: {
      sourceType: 'module',
    },
  },
];
