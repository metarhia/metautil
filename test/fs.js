'use strict';

const metatests = require('metatests');
const fs = require('fs');
const path = require('path');
const { mkdirp, rmdirp, rmRecursive, rmRecursivePromise } = require('..');

const testMkdirp = metatests.test('mkdir');
const mkdirpTestDir = 'test/ex1/ex2';
const RMDIRP_TEST_DIR = 'testDir';
const RMRECURSIVE_TEST_DIR = 'test/rmRecursiveTest';

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

const createHierarchy = (hierarchy, cb) => {
  if (hierarchy.length === 0) {
    cb(null);
    return;
  }

  let data = '';
  let file = hierarchy[0];
  if (Array.isArray(file)) {
    data = file[1] || '';
    file = file[0];
  }

  if (file.endsWith('/')) {
    fs.mkdir(file, err => {
      if (err) cb(err);
      else createHierarchy(hierarchy.slice(1), cb);
    });
  } else {
    fs.writeFile(file, data, err => {
      if (err) cb(err);
      else createHierarchy(hierarchy.slice(1), cb);
    });
  }
};

const hierarchy = [
  './',
  '1/',
  '2/',
  ['2/3', 'data'],
  '2/4.file',
  '2/5/',
  '2/6/',
  '2/6/7',
].map(f => {
  if (Array.isArray(f)) {
    return [path.join(RMRECURSIVE_TEST_DIR, f[0]), f[1]];
  } else {
    return path.join(RMRECURSIVE_TEST_DIR, f);
  }
});

const rmRecursiveTest = metatests.test('recursively remove folder hierarchy');
rmRecursiveTest.endAfterSubtests();

rmRecursiveTest.beforeEach((test, cb) => {
  createHierarchy(hierarchy, err => {
    if (err) {
      test.fail('Cannot create folder hierarchy', err);
      test.end();
      cb();
      return;
    }
    fs.access(RMRECURSIVE_TEST_DIR, err => {
      if (err) {
        test.fail('Cannot access created folder hierarchy', err);
        test.end();
      }
      cb();
    });
  });
});

rmRecursiveTest.afterEach((test, cb) => {
  fs.access(RMRECURSIVE_TEST_DIR, err => {
    if (!err) test.fail('Created folder hierarchy was not removed', err);
    cb();
  });
});

rmRecursiveTest.test('rmRecursive', test => {
  rmRecursive(
    RMRECURSIVE_TEST_DIR,
    test.cbFail('Cannot remove folder hierarchy with callbacks', () =>
      test.end()
    )
  );
});

rmRecursiveTest.test('rmRecursivePromise', () =>
  rmRecursivePromise(RMRECURSIVE_TEST_DIR)
);
