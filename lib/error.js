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

class DomainError extends Error {
  constructor(code, options = {}) {
    const hasCode = typeof code !== 'object';
    const opt = hasCode ? { ...options, code } : code;
    super('Domain error', opt);
  }

  toError(errors) {
    const { code, cause } = this;
    const message = errors[this.code] || this.message;
    return new Error(message, { code, cause });
  }
}

const isError = (err) => err?.constructor?.name?.includes('Error') || false;

module.exports = { Error, DomainError, isError };
