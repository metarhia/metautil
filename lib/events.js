'use strict';

class EventEmitter {
  constructor(options = {}) {
    this.events = new Map();
    this.maxListeners = options.maxListeners || 10;
  }

  emit(name, ...args) {
    const listeners = this.events.get(name);
    if (!listeners) return null;
    const promises = listeners.map((fn) => fn(...args));
    return Promise.all(promises);
  }

  on(name, fn) {
    const listeners = this.events.get(name);
    if (!listeners) return void this.events.set(name, [fn]);
    if (listeners.includes(fn)) {
      console.warn(`Duplicate listeners detected: ${fn.name}`);
    }
    listeners.push(fn);
    const tooManyListeners = listeners.size > this.maxListeners;
    if (tooManyListeners) {
      const name = 'MaxListenersExceededWarning';
      const warn = 'Possible EventEmitter memory leak detected';
      const max = `Current maxListenersCount is ${this.maxListeners}`;
      const hint = 'Hint: avoid adding listeners in loops';
      console.warn(`${name}: ${warn}. ${max}. ${hint}`);
    }
  }

  once(name, fn) {
    const dispose = (...args) => {
      this.off(name, dispose);
      return void fn(...args);
    };
    this.on(name, dispose);
  }

  off(name, fn) {
    const listeners = this.events.get(name);
    if (!listeners) return;
    const index = listeners.indexOf(fn);
    listeners.splice(index, 1);
    if (listeners.length === 0) {
      this.events.delete(name);
    }
  }

  toPromise(name) {
    return new Promise((resolve) => {
      this.once(name, resolve);
    });
  }

  toIterator(name) {
    const data = [];
    const promises = [];
    let error = null;
    const handleEvent = (...value) => {
      if (promises.length) {
        promises.shift().resolve({ value, done: false });
      } else {
        data.push(value);
      }
    };
    const handleError = (err) => {
      this.off(name, handleEvent);
      this.off('error', handleError);
      if (err && promises.length) {
        promises.shift().reject(err);
      } else if (err) {
        error = err;
      }
    };
    this.on(name, handleEvent);
    this.on('error', handleError);
    return {
      [Symbol.asyncIterator]() {
        return {
          next() {
            return new Promise((resolve, reject) => {
              if (error) reject(error);
              const value = data.shift();
              if (value) resolve({ value, done: false });
              else promises.push({ resolve, reject });
            });
          },
          return() {
            handleError();
            return Promise.resolve({ value: undefined, done: true });
          },
          throw(err) {
            handleError();
            return Promise.reject(err);
          },
        };
      },
    };
  }

  clear(name) {
    if (!name) return void this.events.clear();
    this.events.delete(name);
  }

  listeners(name) {
    return this.events.get(name) || [];
  }

  listenerCount(name) {
    const listeners = this.events.get(name);
    if (listeners) return listeners.length;
    return 0;
  }

  eventNames() {
    return Array.from(this.events.keys());
  }
}

module.exports = { EventEmitter };
