'use strict';

const init = require('eslint-config-metarhia');

init[0].languageOptions.globals.crypto = true;
init[0].ignores.push('./dist.js');

module.exports = [...init];
