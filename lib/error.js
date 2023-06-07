'use strict';

class Error extends global.Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

const isError = (err) => err?.constructor?.name?.includes('Error') || false;

module.exports = { Error, isError };
