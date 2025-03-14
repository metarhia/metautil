'use strict';

const DONE = { done: true, value: undefined };

class EventIterator {
  #resolvers = [];
  #emitter = null;
  #eventName = '';
  #listener = null;
  #onerror = null;
  #done = false;

  constructor(emitter, eventName) {
    this.#emitter = emitter;
    this.#eventName = eventName;

    this.#listener = (value) => {
      for (const resolver of this.#resolvers) {
        resolver.resolve({ done: this.#done, value });
      }
    };
    emitter.on(eventName, this.#listener);

    this.#onerror = (error) => {
      for (const resolver of this.#resolvers) {
        resolver.reject(error);
      }
      this.#finalize();
    };
    emitter.on('error', this.#onerror);
  }

  next() {
    return new Promise((resolve, reject) => {
      if (this.#done) return void resolve(DONE);
      this.#resolvers.push({ resolve, reject });
    });
  }

  #finalize() {
    if (this.#done) return;
    this.#done = true;
    this.#emitter.off(this.#eventName, this.#listener);
    this.#emitter.off('error', this.#onerror);
    for (const resolver of this.#resolvers) {
      resolver.resolve(DONE);
    }
    this.#resolvers.length = 0;
  }

  async return() {
    this.#finalize();
    return DONE;
  }

  async throw() {
    this.#finalize();
    return DONE;
  }
}

class EventIterable {
  #emitter = null;
  #eventName = '';

  constructor(emitter, eventName) {
    this.#emitter = emitter;
    this.#eventName = eventName;
  }

  [Symbol.asyncIterator]() {
    return new EventIterator(this.#emitter, this.#eventName);
  }
}

class Emitter {
  #events = new Map();
  #wrappers = new Map();
  #maxListeners = 10;

  constructor(options = {}) {
    this.#maxListeners = options.maxListeners ?? 10;
  }

  emit(eventName, value) {
    const listeners = this.#events.get(eventName);
    if (!listeners) return Promise.resolve();

    const promises = listeners.map((fn) => fn(value));
    return Promise.all(promises).then(() => undefined);
  }

  on(eventName, listener) {
    const listeners = this.#events.get(eventName) || [];
    if (listeners.includes(listener)) {
      throw new Error('Duplicate listeners detected');
    }
    listeners.push(listener);
    this.#events.set(eventName, listeners);

    if (listeners.length > this.#maxListeners) {
      throw new Error(
        `MaxListenersExceededWarning: Possible memory leak. ` +
          `Current maxListeners is ${this.#maxListeners}.`,
      );
    }
  }

  once(eventName, listener) {
    const wrapper = (value) => {
      this.off(eventName, listener);
      listener(value);
    };
    wrapper.origin = listener;
    this.on(eventName, wrapper);
    this.#wrappers.set(listener, wrapper);
  }

  off(eventName, listener) {
    if (!listener) return void this.clear(eventName);

    const listeners = this.#events.get(eventName);
    if (!listeners) return;

    const keep = (f) => f !== listener && f !== this.#wrappers.get(listener);
    const updated = listeners.filter(keep);

    this.#events.set(eventName, updated);
    this.#wrappers.delete(listener);
  }

  toPromise(eventName) {
    return new Promise((resolve) => {
      this.once(eventName, resolve);
    });
  }

  toAsyncIterable(eventName) {
    return new EventIterable(this, eventName);
  }

  clear(eventName) {
    if (!eventName) {
      this.#events.clear();
      this.#wrappers.clear();
      return;
    }
    const listeners = this.#events.get(eventName);
    if (!listeners) return;
    for (const listener of listeners) {
      this.#wrappers.delete(listener);
    }
    this.#events.delete(eventName);
  }

  listeners(eventName) {
    if (eventName) {
      const listeners = this.#events.get(eventName) || [];
      return listeners.map((listener) => listener.origin || listener);
    }
    return Array.from(this.#events.values()).flat();
  }

  listenerCount(eventName) {
    if (eventName) {
      return this.#events.get(eventName)?.length || 0;
    }
    const listeners = this.#events.values();
    return Array.from(listeners).reduce((acc, { length }) => acc + length, 0);
  }

  eventNames() {
    return Array.from(this.#events.keys());
  }
}

module.exports = { Emitter };
