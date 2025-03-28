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

  emit(eventName, value) {
    const events = this.#events.get(eventName) || [];
    if (events.length === 0) {
      if (eventName !== 'error') return Promise.resolve();
      throw new Error('Unhandled error');
    }

    const promises = events.map(async (fn) => fn(value));

    const onceEvents = this.#onceEvents.get(eventName);
    if (onceEvents?.size) {
      for (const onceEvent of onceEvents) {
        this.off(eventName, onceEvent);
      }
    }

    return Promise.all(promises).then(() => undefined);
  }

  on(eventName, listener) {
    if (this.#events.get(eventName)?.includes(listener)) {
      throw new Error('Duplicate listeners detected');
    }

    const events = this.#events.get(eventName) || [];
    if (events.length >= this.#maxListeners) {
      throw new Error(
        `MaxListenersExceededWarning: Possible memory leak. ` +
          `Current maxListeners is ${this.#maxListeners}.`,
      );
    }

    events.push(listener);
    this.#events.set(eventName, events);
  }

  once(eventName, listener) {
    this.on(eventName, listener);

    const onceEvents = this.#onceEvents.get(eventName) || new Set();
    onceEvents.add(listener);
    this.#onceEvents.set(eventName, onceEvents);
  }

  off(eventName, listener) {
    if (!listener) return void this.clear(eventName);

    const events = this.#events.get(eventName) || [];
    const listenerIndex = events.indexOf(listener);
    if (listenerIndex > -1) events.splice(listenerIndex, 1);

    const onceEvents = this.#onceEvents.get(eventName);
    if (onceEvents?.has(listener)) onceEvents.delete(listener);
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
      this.#onceEvents.clear();
      return;
    }
    this.#events.delete(eventName);
    this.#onceEvents.delete(eventName);
  }

  listeners(eventName) {
    if (eventName) {
      return this.#events.get(eventName) || [];
    }
    return Array.from(this.#events.values()).flat();
  }

  listenerCount(eventName) {
    const events = this.#events.get(eventName);
    return events ? events.length : 0;
  }

  eventNames() {
    return Array.from(this.#events.keys());
  }
}

module.exports = { Emitter };
