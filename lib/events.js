'use strict';

class EventIterator {
  promise;
  constructor(emitter, eventName) {
    this.value = null;
    this.isPending = false;
    this.done = false;
    const handleEvent = (...value) => {
      if (this.isPending) {
        this.isPending = false;
        this.promise.resolve({ value, done: this.done });
      } else {
        this.value = value;
      }
    };
    this.handleError = (err) => {
      emitter.off(eventName, handleEvent);
      emitter.off('error', this.handleError);
      this.done = true;
      if (this.isPending) {
        this.isPending = false;
        const promise = this.promise;
        if (err) {
          promise.reject(err);
        } else {
          promise.resolve({ value: undefined, done: this.done });
        }
      }
    };
    emitter.on(eventName, handleEvent);
    emitter.on('error', this.handleError);
  }

  next() {
    const done = this.done;
    if (done) {
      return Promise.resolve({ done, value: undefined });
    }
    if (this.value !== null) {
      const value = this.value;
      this.value = null;
      return Promise.resolve({ value, done });
    }
    this.isPending = true;
    return new Promise((resolve, reject) => {
      this.promise = { resolve, reject };
    });
  }

  return() {
    this.handleError();
    return Promise.resolve({ done: this.done, value: undefined });
  }

  throw(err) {
    this.handleError(err);
    return Promise.reject(err);
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}

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
    return new EventIterator(this, name);
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
