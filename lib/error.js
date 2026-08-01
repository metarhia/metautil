'use strict';

class Error extends globalThis.Error {
  constructor(message, options = {}) {
    super(message);
    const hasOptions = options !== null && typeof options === 'object';
    const opts = hasOptions ? options : { code: options };
    const { code, cause, name = new.target.name } = opts;
    this.code = code;
    this.cause = cause;
    this.name = name;
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
