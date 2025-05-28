'use strict';

class Future {
  #executor;

  constructor(executor) {
    this.#executor = executor;
  }

  static of(value) {
    return new Future((resolve) => resolve(value));
  }

  chain(fn) {
    return new Future((resolve, reject) =>
      this.fork(
        (value) => fn(value).fork(resolve, reject),
        (error) => reject(error),
      ),
    );
  }

  map(fn) {
    return new Future((resolve, reject) =>
      this.fork(
        (value) =>
          new Future((resolve, reject) => {
            try {
              resolve(fn(value));
            } catch (error) {
              reject(error);
            }
          }).fork(resolve, reject),
        (error) => reject(error),
      ),
    );
  }

  fork(successed, failed) {
    this.#executor(successed, failed);
  }

  toPromise() {
    return new Promise((resolve, reject) => {
      this.fork(resolve, reject);
    });
  }

  toThenable() {
    const then = (resolve, reject) => {
      this.fork(resolve, reject);
    };
    return { then };
  }
}

const futurify =
  (fn) =>
  (...args) =>
    new Future((resolve, reject) => {
      fn(...args, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

module.exports = { Future, futurify };
