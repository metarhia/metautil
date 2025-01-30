'use strict';

class EventIterator {
  #step;
  constructor(context) {
    this.#step = context.step;
    this.handleReturn = context.handleReturn;
    this.handleError = context.handleError;
  }

  next() {
    const { data } = this.#step;
    if (data.done) {
      return Promise.resolve(data);
    }
    if (data.value) {
      data.value = undefined;
      return Promise.resolve(data);
    }
    this.#step.pending = true;
    return new Promise((resolve, reject) => {
      this.#step.promise = { resolve, reject };
    });
  }

  return() {
    this.handleReturn();
    return Promise.resolve(this.#step.data);
  }

  throw(err) {
    this.handleError(err);
    return Promise.reject(err);
  }
}

class EventIterable {
  constructor(iterator) {
    this.iterator = iterator;
  }
  [Symbol.asyncIterator]() {
    return this.iterator;
  }
}

class Emitter {
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

  toAsyncIterable(name) {
    const step = {
      pending: false,
      promise: null,
      data: {
        value: undefined,
        done: false,
      },
    };
    const handleEvent = (value) => {
      if (step.pending) {
        step.pending = false;
        const { done } = step.data;
        step.promise.resolve({ value, done });
      } else {
        step.data.value = value;
      }
    };
    const handlers = {
      handleReturn: () => {
        handlers.handleClean();
        handlers.handlePending();
      },
      handleError: (err) => {
        handlers.handleClean();
        handlers.handlePending(err);
      },
      handleClean: () => {
        this.off(name, handleEvent);
        this.off('error', handlers.handleError);
        step.data.value = undefined;
        step.data.done = true;
      },
      handlePending: (err) => {
        if (step.pending) {
          step.pending = false;
          if (err) step.promise.reject(err);
          else step.promise.resolve(step.data);
        }
      },
    };
    this.on(name, handleEvent);
    this.on('error', handlers.handleError);
    const { handleError, handleReturn } = handlers;
    const iterator = new EventIterator({ handleError, handleReturn, step });
    return new EventIterable(iterator);
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

module.exports = { Emitter };
