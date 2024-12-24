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
    const queue = [];
    let resolver = null;
    const stub = (...value) => {
      if (resolver) {
        resolver({ value });
        resolver = null;
      } else {
        queue.push(value);
      }
    };
    this.on(name, stub);
    const clean = () => this.off(name, stub);
    return {
      next() {
        const value = queue.shift();
        return new Promise((resolve) => {
          if (value) {
            resolve({ value });
          } else {
            resolver = resolve;
          }
        });
      },
      return() {
        clean();
        return Promise.resolve({ done: true });
      },
      throw(err) {
        clean();
        return Promise.reject(err);
      },
      [Symbol.asyncIterator]() {
        return this;
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
