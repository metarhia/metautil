'use strict';

class Error extends global.Error {
  constructor(message, options = {}) {
    super(message);
    const hasOptions = typeof options === 'object';
    const { code, cause } = hasOptions ? options : { code: options };
    this.code = code;
    this.cause = cause;
  }
}

const isError = (err) => err?.constructor?.name?.includes('Error') || false;

module.exports = { Error, isError };
