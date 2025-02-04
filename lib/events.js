'use strict';

class EventAsyncIterator {
  #step;
  #cleanup;
  constructor(source) {
    this.#step = source.step;
    this.#cleanup = source.cleanup;
  }

  next() {
    const { data } = this.#step;
    const { done, value } = data;
    if (done) return Promise.resolve(data);
    if (value) {
      data.value = undefined;
      return Promise.resolve({ done, value });
    }
    this.#step.pending = true;
    return new Promise((resolve, reject) => {
      this.#step.promise = { resolve, reject };
    });
  }

  return() {
    this.#cleanup();
    return Promise.resolve(this.#step.data);
  }

  throw(err) {
    this.#cleanup(err);
    return Promise.reject(err);
  }
}

class EventAsyncIterable {
  #iterator;
  constructor(emitter, eventName) {
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
        step.promise.resolve({ value, done: step.data.done });
      } else {
        step.data.value = value;
      }
    };
    const cleanup = (err) => {
      emitter.off(eventName, handleEvent);
      emitter.off('error', cleanup);
      step.data.done = true;
      step.data.value = undefined;
      if (step.pending) {
        step.pending = false;
        if (err) step.promise.reject(err);
        else step.promise.resolve(step.data);
      }
    };
    emitter.on(eventName, handleEvent);
    emitter.on('error', cleanup);
    this.#iterator = new EventAsyncIterator({ step, cleanup });
  }

  [Symbol.asyncIterator]() {
    return this.#iterator;
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
    return new EventAsyncIterable(this, name);
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
