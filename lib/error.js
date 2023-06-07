'use strict';

class Error extends global.Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

module.exports = { Error };
