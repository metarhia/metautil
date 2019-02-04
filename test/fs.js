'use strict';

const metatests = require('metatests');
const fs = require('fs');
const { mkdirp } = require('..');
const path = require('path');

const testMkdirp = metatests.test('mkdir');
const mkdirpTestDir = 'test/ex1/ex2';

const removeUsedDirs = (test, cb) => {
  fs.rmdir(mkdirpTestDir, err => {
    if (err && err.code !== 'ENOENT') test.error(err);
    fs.rmdir(path.dirname(mkdirpTestDir), err => {
      if (err && err.code !== 'ENOENT') test.error(err);
      cb();
    });
  });
};

testMkdirp.beforeEach(removeUsedDirs);
testMkdirp.afterEach(removeUsedDirs);

testMkdirp.test('create 2 directories using mode', test => {
  mkdirp(mkdirpTestDir, 0o777, err => {
    test.error(err, 'Cannot create directory');
    test.end();
  });
});

testMkdirp.test('create 2 directories without mode', test => {
  mkdirp(mkdirpTestDir, err => {
    test.error(err, 'Cannot create directory');
    test.end();
  });
});
