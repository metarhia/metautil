'use strict';

const fs = require('fs');
const path = require('path');
const MKDIRP_DEFAULT_MODE = 0o777;

const mkdir = (dir, mode, cb) => {
  fs.access(dir, fs.constants.F_OK, err => {
    if (err && err.code === 'ENOENT') {
      mkdir(path.dirname(dir), mode, err => {
        if (err) cb(err);
        else fs.mkdir(dir, mode, cb);
      });
    } else {
      cb(err);
    }
  });
};

const recursivelyListDirs = dir => {
  const list = [dir];
  let nextDir = dir;
  const root = path.parse(dir).root || '.';
  while ((nextDir = path.dirname(nextDir)) !== root) list.push(nextDir);
  return list;
};

const rmdirp = (dir, cb) => {
  const dirs = recursivelyListDirs(dir);
  let i = 0;
  rmNextDir();
  function rmNextDir() {
    fs.rmdir(dirs[i], err => {
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
const version = process.versions.node.split('.').map(el => parseInt(el));
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

module.exports = {
  mkdirp,
  rmdirp,
};
