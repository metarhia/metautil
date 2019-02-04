'use strict';

const metatests = require('metatests');
const fs = require('fs');
const path = require('path');
const { mkdirp, rmdirp } = require('..');

const testMkdirp = metatests.test('mkdir');
const mkdirpTestDir = 'test/ex1/ex2';
const RMDIRP_TEST_DIR = 'testDir';

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

metatests.test('rmdirp test', test =>
  fs.mkdir(RMDIRP_TEST_DIR, err => {
    if (err && err.code !== 'EEXISTS') {
      test.bailout(err);
    }
    fs.mkdir(path.join(RMDIRP_TEST_DIR, 'subdir1'), err => {
      if (err && err.code !== 'EEXISTS') {
        test.bailout(err);
      }
      rmdirp(path.join(RMDIRP_TEST_DIR, 'subdir1'), err => {
        if (err) {
          test.bailout(err);
        }
        fs.access(RMDIRP_TEST_DIR, err => {
          test.isError(err);
          test.end();
        });
      });
    });
  })
);
