'use strict';

const units = require('./units');

const stream = require('stream');

const buffer = Symbol('buffer');
const storageLeft = Symbol('storageLeft');

const SIZE_LIMIT = 8 * 1000 * 1000; // 8 MB

class MemoryWritable extends stream.Writable {
  // Signature: [sizeLimit]
  //   sizeLimit <number> | <string> limit of the internal buffer size specified
  //       as number in bytes or as string in format supported by
  //       `common.bytesToSize()`. Defaults to 8 MB
  constructor(sizeLimit = SIZE_LIMIT) {
    super();

    this[buffer] = [];
    this[storageLeft] = units.sizeToBytes(sizeLimit);
    this.finished = false;
    this.once('finish', () => {
      this.finished = true;
    });
  }

  // #private
  _write(chunk, encoding, callback) {
    this[storageLeft] -= chunk.length;
    if (this[storageLeft] < 0) {
      callback(
        new RangeError(`size limit exceeded by ${-this[storageLeft]} bytes`)
      );
      return;
    }
    this[buffer].push(chunk);
    callback();
  }

  // #private
  _final(callback) {
    this[buffer] = Buffer.concat(this[buffer]);
    callback();
  }

  // Return a Promise that will be resolved with all the written data once it
  // becomes available.
  // Signature: [encoding]
  //   encoding - <string> encoding to convert the resulting data to, must be a
  //       valid <Buffer> encoding
  // Returns: <Promise>
  async getData(encoding) {
    return new Promise((resolve, reject) => {
      const finishCallback = () => {
        this.removeListener('error', reject);
        let buf = Buffer.from(this[buffer]);
        if (encoding) {
          try {
            buf = buf.toString(encoding);
          } catch (e) {
            reject(e);
            return;
          }
        }
        resolve(buf);
      };
      if (this.finished) {
        finishCallback();
      } else {
        this.once('error', reject);
        this.once('finish', finishCallback);
      }
    });
  }
}

module.exports = {
  MemoryWritable,
};
