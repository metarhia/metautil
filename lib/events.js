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
      console.warn(`Duplicate listeners detected`);
    }
    listeners.push(listener);
    if (listeners.length <= maxListeners) return;
    const title = 'MaxListenersExceededWarning';
    const warn = 'Possible EventEmitter memory leak detected';
    const max = `Current maxListeners is ${maxListeners}`;
    const hint = 'Hint: avoid adding listeners in loops';
    console.warn(`${title}: ${warn}. ${max}. ${hint}`);
  }

  once(eventName, listener) {
    const wrapper = (value) => {
      this.off(eventName, listener);
      return listener(value);
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

  clear(eventName) {
    const { events, wrappers } = this;
    if (!eventName) {
      events.clear();
      return void wrappers.clear();
    }
    const listeners = events.get(eventName);
    if (!listeners) return;
    for (const listener of listeners) wrappers.delete(listener);
    events.delete(eventName);
  }

  listeners(eventName) {
    const result = [];
    if (!eventName) {
      const eventNames = this.events.keys();
      for (const name of eventNames) {
        const listeners = this.listeners(name);
        result.push(...listeners);
      }
      return result;
    }
    const listeners = this.events.get(eventName);
    if (!listeners) return result;
    for (const listener of listeners) {
      const origin = listener.origin ?? listener;
      result.push(origin);
    }
    return result;
  }

  listenerCount(eventName) {
    if (!eventName) {
      const listeners = Array.from(this.events.values());
      return listeners.reduce((total, cur) => total + cur.length, 0);
    }
    const listeners = this.events.get(eventName);
    return listeners ? listeners.length : 0;
  }

  eventNames() {
    return Array.from(this.events.keys());
  }
}

module.exports = { Emitter };
