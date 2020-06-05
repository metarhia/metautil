#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');
const common = require('../common');

const COMMON_JS_FILENAME = 'common.js';
const COMMON_MJS_FILEPATH = './common.mjs';

const header = indexPath =>
  `// This is an automaticaly generated file. DO NOT MODIFY MANUALLY.
import common from './${indexPath}';

export default common;

`;

const generateExports = exportsData =>
  Object.keys(exportsData)
    .map(name => `export const ${name} = common.${name};`)
    .join('\n');

const root = path.join(__dirname, '..');
const indexDirectory = path.dirname(path.resolve(COMMON_MJS_FILEPATH));
const indexRel = path.relative(indexDirectory, path.resolve(root));
const indexRelPath = path.join(indexRel, COMMON_JS_FILENAME);

const exportsString = header(indexRelPath) + generateExports(common) + '\n';

fs.writeFile(COMMON_MJS_FILEPATH, exportsString, err => {
  if (err) {
    console.error('Failed to generate ECMAScript Modules export file.\n' + err);
    process.exit(1);
  }
  console.log('Successfully generated ECMAScript Modules export file.');
});
