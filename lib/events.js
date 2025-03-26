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
  #onceEvents = new Map();
  #maxListeners = 10;

  constructor(options = {}) {
    this.#maxListeners = options.maxListeners ?? 10;
  }

  async emit(eventName, value) {
    const listeners = this.#events.get(eventName);
    const onceListeners = this.#onceEvents.get(eventName);

    if (!listeners) {
      if (eventName !== 'error') return;
      throw new Error('Unhandled error');
    }

    const promises = listeners.map((fn) => {
      if (onceListeners.has(fn)) this.off(eventName, fn);
      return fn(value);
    });

    await Promise.all(promises);
  }

  on(eventName, listener) {
    const listeners = this.#events.get(eventName) || [];
    if (listeners.length) {
      if (listeners.includes(listener)) {
        throw new Error('Duplicate listeners detected');
      }
    } else {
      this.#events.set(eventName, listeners);
      this.#onceEvents.set(eventName, new Set());
    }

    listeners.push(listener);

    if (listeners.length > this.#maxListeners) {
      throw new Error(
        `MaxListenersExceededWarning: Possible memory leak. ` +
          `Current maxListeners is ${this.#maxListeners}.`,
      );
    }
  }

  once(eventName, listener) {
    try {
      this.on(eventName, listener);
      const onceListeners = this.#onceEvents.get(eventName);
      onceListeners.add(listener);
    } catch (e) {
      if (e.message !== 'Duplicate listeners detected') {
        const onceListeners = this.#onceEvents.get(eventName);
        onceListeners.add(listener);
      }
      throw e;
    }
  }

  off(eventName, listener) {
    const listeners = this.#events.get(eventName);
    if (!listeners) return;

    if (!listener) return void this.clear(eventName);

    const newListeners = listeners.filter((fn) => fn !== listener);
    this.#events.set(eventName, newListeners);
    const onceListeners = this.#onceEvents.get(eventName);
    onceListeners.delete(listener);
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
    if (eventName) {
      this.#events.delete(eventName);
      this.#onceEvents.delete(eventName);
    } else {
      this.#events.clear();
      this.#onceEvents.clear();
    }
  }

  listeners(eventName) {
    if (eventName) return this.#events.get(eventName) || [];
    return Array.from(this.#events.values()).flat();
  }

  listenerCount(eventName) {
    const events = this.#events.get(eventName) || [];
    return events.length;
  }

  eventNames() {
    return this.#events.keys();
  }
}

module.exports = { Emitter };
