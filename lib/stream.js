'use strict';

const stream = require('stream');

const buffer = Symbol('buffer');

class MemoryWritable extends stream.Writable {
  constructor() {
    super();

    this[buffer] = [];
    this.finished = false;
    this.once('finish', () => {
      this.finished = true;
    });
  }

  // #private
  _write(chunk, encoding, callback) {
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
