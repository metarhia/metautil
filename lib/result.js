'use strict';

const NO_DEFAULT = Symbol('NoDefault');

class Result {
  #value = null;
  #error = null;

  constructor(value = null, error = null) {
    if (value !== null) this.#value = value;
    if (error !== null) this.#error = error;
  }

  static ok(value = null) {
    return new Result(value, null);
  }

  static fail(error) {
    return new Result(null, error);
  }

  static from(fn) {
    try {
      return Result.ok(fn());
    } catch (error) {
      return Result.fail(error);
    }
  }

  static async fromAsync(fn) {
    try {
      return Result.ok(await fn());
    } catch (error) {
      return Result.fail(error);
    }
  }

  get value() {
    return this.#value;
  }

  get error() {
    return this.#error;
  }

  get ok() {
    return this.#error === null;
  }

  unwrap(defaultValue = NO_DEFAULT) {
    if (this.#error === null) return this.#value;
    if (defaultValue === NO_DEFAULT) throw this.#error;
    return defaultValue;
  }

  map(fn) {
    if (this.#error !== null) return this;
    return Result.from(() => fn(this.#value));
  }
}

module.exports = { Result };
