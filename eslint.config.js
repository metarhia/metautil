'use strict';

const init = require('eslint-config-metarhia');

module.exports = [
  ...init,
  {
    files: ['**/*.mjs'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        crypto: true,
      },
    },
  },
];
