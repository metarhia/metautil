'use strict';

const fs = require('fs');
const path = require('path');

fs.readdir(__dirname, (err, files) => {
  if (err) return console.error('Failed to run tests: ', err);
  const thisFilename = path.basename(__filename);
  files.filter(file => file !== thisFilename)
    .forEach(name => require('./' + name));
});
