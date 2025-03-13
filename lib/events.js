'use strict';

class EventIterator {
  #step = null;
  #resolve = null;
  #reject = null;

  constructor({ step, resolve, reject }) {
    this.#step = step;
    this.#resolve = resolve;
    this.#reject = reject;
  }

  next() {
    const { data } = this.#step;
    if (data.done) return Promise.resolve(data);
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
    this.#resolve();
    return Promise.resolve(this.#step.data);
  }

  throw(error) {
    this.#reject(error);
    return Promise.reject(error);
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
    this.wrappers = new Map();
    this.maxListeners = options.maxListeners ?? 10;
  }

  emit(eventName, value) {
    const listeners = this.events.get(eventName);
    if (!listeners) return Promise.resolve();
    const promises = listeners.map((fn) => fn(value));
    return Promise.all(promises).then(() => undefined);
  }

  on(eventName, listener) {
    const { events, maxListeners } = this;
    const listeners = events.get(eventName);
    if (!listeners) return void events.set(eventName, [listener]);
    if (listeners.includes(listener)) {
      throw new Error('Duplicate listeners detected');
    }
    listeners.push(listener);
    if (listeners.length <= maxListeners) return;
    const title = 'MaxListenersExceededWarning';
    const warn = 'Possible EventEmitter memory leak detected';
    const max = `Current maxListeners is ${maxListeners}`;
    const hint = 'Hint: avoid adding listeners in loops';
    throw new Error(`${title}: ${warn}. ${max}. ${hint}`);
  }

  once(eventName, listener) {
    const wrapper = (value) => {
      this.off(eventName, listener);
      return void listener(value);
    };
    wrapper.origin = listener;
    this.on(eventName, wrapper);
    this.wrappers.set(listener, wrapper);
  }

  off(eventName, listener) {
    if (!listener) return void this.clear(eventName);
    const listeners = this.events.get(eventName);
    if (!listeners) return;
    const index = listeners.indexOf(listener);
    if (index >= 0) listeners.splice(index, 1);
    const wrapped = this.wrappers.get(listener);
    if (wrapped) {
      listeners.splice(listeners.indexOf(wrapped), 1);
      this.wrappers.delete(listener);
    }
    if (listeners.length === 0) this.events.delete(eventName);
  }

  toPromise(eventName) {
    return new Promise((resolve) => {
      this.once(eventName, resolve);
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
      resolve: () => {
        handlers.handleClean();
        handlers.handlePending();
      },
      reject: (error) => {
        handlers.handleClean();
        handlers.handlePending(error);
      },
      handleClean: () => {
        this.off(name, handleEvent);
        this.off('error', handlers.reject);
        step.data.value = undefined;
        step.data.done = true;
      },
      handlePending: (error) => {
        if (step.pending) {
          step.pending = false;
          if (error) step.promise.reject(error);
          else step.promise.resolve(step.data);
        }
      },
    };
    this.on(name, handleEvent);
    this.on('error', handlers.reject);
    const { reject, resolve } = handlers;
    const iterator = new EventIterator({ reject, resolve, step });
    return new EventIterable(iterator);
  }

  clear(eventName) {
    const { events, wrappers } = this;
    if (!eventName) {
      events.clear();
      wrappers.clear();
      return;
    }
    const listeners = events.get(eventName);
    if (!listeners) return;
    for (const listener of listeners) wrappers.delete(listener);
    events.delete(eventName);
  }

  listeners(eventName) {
    if (!eventName) {
      return Array.from(this.events.values()).flat();
    }
    const listeners = this.events.get(eventName);
    if (!listeners) return [];
    for (let i = 0; i < listeners.length; i++) {
      const { origin } = listeners[i];
      if (origin) listeners[i] = origin;
    }
    return listeners;
  }

  listenerCount(eventName) {
    if (!eventName) {
      const handlers = this.events.values();
      return handlers.reduce((acc, listeners) => acc + listeners.length, 0);
    }
    const listeners = this.events.get(eventName);
    return listeners ? listeners.length : 0;
  }

  eventNames() {
    return Array.from(this.events.keys());
  }
}

module.exports = { Emitter };
