'use strict';

const fs = require('fs');
const fsp = fs.promises;
const pathModule = require('path');

const MKDIRP_DEFAULT_MODE = 0o777;

const mkdir = (dir, mode, cb) => {
  fs.access(dir, fs.constants.F_OK, (err) => {
    if (err && err.code === 'ENOENT') {
      mkdir(pathModule.dirname(dir), mode, (err) => {
        if (err) cb(err);
        else fs.mkdir(dir, mode, cb);
      });
    } else {
      cb(err);
    }
  });
};

const recursivelyListDirs = (dir) => {
  const list = [dir];
  let nextDir = dir;
  const root = pathModule.parse(dir).root || '.';
  while ((nextDir = pathModule.dirname(nextDir)) !== root) list.push(nextDir);
  return list;
};

const rmdirp = (dir, cb) => {
  const dirs = recursivelyListDirs(dir);
  let i = 0;
  rmNextDir();
  function rmNextDir() {
    fs.rmdir(dirs[i], (err) => {
      if (err) {
        cb(err);
        return;
      }
      if (++i === dirs.length) {
        cb();
      } else {
        rmNextDir();
      }
    });
  }
};

let mkdirp;
const version = process.versions.node.split('.').map((el) => parseInt(el));
if (version[0] < 10 || (version[0] === 10 && version[1] <= 11)) {
  mkdirp = (dir, mode, cb) => {
    if (typeof mode === 'function') {
      cb = mode;
      mode = MKDIRP_DEFAULT_MODE;
    }
    mkdir(dir, mode, cb);
  };
} else {
  mkdirp = (dir, mode, cb) => {
    typeof mode === 'function'
      ? fs.mkdir(dir, { recursive: true }, mode)
      : fs.mkdir(dir, { recursive: true, mode }, cb);
  };
}

const isNotDirectoryError = (err) =>
  err.code === 'ENOTDIR' ||
  (process.platform === 'win32' && err.code === 'ENOENT');

// Recursively remove directory
//   path <string> path to a file or directory to be removed
//   callback <Function> callback
const rmRecursive = (path, callback) => {
  fs.readdir(path, (err, files) => {
    if (err) {
      if (isNotDirectoryError(err)) fs.unlink(path, callback);
      else callback(err);
      return;
    }
    if (files.length === 0) {
      fs.rmdir(path, callback);
      return;
    }

    let errored = false;
    let counter = files.length;
    const cb = (err) => {
      if (errored) return;
      if (err) {
        errored = true;
        callback(err);
      } else if (--counter === 0) {
        fs.rmdir(path, callback);
      }
    };
    files.forEach((f) => rmRecursive(pathModule.join(path, f), cb));
  });
};

// Recursively remove directory
//   path <string> path to a file or directory to be removed
// Returns: <Promise>
const rmRecursivePromise = async (path) =>
  fsp.readdir(path).then(
    async (files) => {
      await Promise.all(
        files.map((f) => rmRecursivePromise(pathModule.join(path, f)))
      );
      return fsp.rmdir(path);
    },
    (err) => {
      if (isNotDirectoryError(err)) return fsp.unlink(path);
      throw err;
    }
  );

const mkdirPromise = async (dir, mode) =>
  fsp.access(dir).then(
    () => Promise.resolve(),
    async () => {
      await mkdirPromise(pathModule.dirname(dir), mode);
      return fsp.mkdir(dir, mode);
    }
  );

let mkdirpPromise;
if (fs.promises) {
  mkdirpPromise = (dir, mode = MKDIRP_DEFAULT_MODE) =>
    fs.promises.mkdir(dir, { recursive: true, mode });
} else {
  mkdirpPromise = (dir, mode = MKDIRP_DEFAULT_MODE) => mkdirPromise(dir, mode);
}

module.exports = {
  mkdirp,
  mkdirpPromise,
  rmdirp,
  rmRecursive,
  rmRecursivePromise,
};
