'use strict';

const DONE = { done: true, value: undefined };
const DEFAULT_MAX_LISTENERS = 10;

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
      const resolvers = this.#resolvers;
      this.#resolvers = [];
      for (const resolver of resolvers) {
        resolver.resolve({ done: false, value });
      }
    };
    emitter.on(eventName, this.#listener);

    this.#onerror = (error) => {
      const resolvers = this.#resolvers;
      this.#resolvers = [];
      for (const resolver of resolvers) {
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
  #maxListeners = DEFAULT_MAX_LISTENERS;

  constructor(options = {}) {
    this.#maxListeners = options.maxListeners ?? DEFAULT_MAX_LISTENERS;
  }

  emit(eventName, value) {
    const event = this.#events.get(eventName);
    if (event === undefined) {
      if (eventName !== 'error') return Promise.resolve();
      throw new Error('Unhandled error');
    }
    const listeners = event.on.slice();
    const promises = listeners.map(async (fn) => fn(value));
    const { on, once } = event;
    if (once.size > 0) {
      const remaining = [];
      for (let i = 0; i < on.length; i++) {
        const listener = on[i];
        if (!once.has(listener)) remaining.push(listener);
      }
      if (remaining.length === 0) {
        this.#events.delete(eventName);
      } else {
        this.#events.set(eventName, { on: remaining, once: new Set() });
      }
    }
    return Promise.all(promises).then(() => undefined);
  }

  #addListener(eventName, listener, once) {
    let event = this.#events.get(eventName);
    if (event === undefined) {
      event = { on: [], once: new Set() };
      this.#events.set(eventName, event);
    } else if (event.on.includes(listener)) {
      throw new Error('Duplicate listeners detected');
    }
    event.on.push(listener);
    if (once) event.once.add(listener);
    if (event.on.length > this.#maxListeners) {
      const max = String(this.#maxListeners);
      throw new Error(
        `MaxListenersExceededWarning: Possible memory leak. ` +
          `Current maxListeners is ${max}.`,
      );
    }
  }

  on(eventName, listener) {
    this.#addListener(eventName, listener, false);
  }

  once(eventName, listener) {
    this.#addListener(eventName, listener, true);
  }

  off(eventName, listener) {
    if (listener === undefined || listener === null) {
      return void this.#events.delete(eventName);
    }
    const event = this.#events.get(eventName);
    if (event === undefined) return;
    const index = event.on.indexOf(listener);
    if (index > -1) event.on.splice(index, 1);
    event.once.delete(listener);
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
    if (eventName === undefined) return void this.#events.clear();
    this.#events.delete(eventName);
  }

  listeners(eventName) {
    if (eventName === undefined) throw new Error('Expected eventName');
    const event = this.#events.get(eventName);
    return event === undefined ? [] : event.on;
  }

  listenerCount(eventName) {
    return this.listeners(eventName).length;
  }

  eventNames() {
    const names = this.#events.keys();
    return Array.from(names);
  }
}

module.exports = { Emitter };
