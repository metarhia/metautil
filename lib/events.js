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
  #onceWrappersMap = new Map();
  #onceToRemove = [];
  #maxListeners = 10;

  constructor(options = {}) {
    this.#maxListeners = options.maxListeners ?? 10;
  }

  emit(eventName, value) {
    const listeners = this.#events.get(eventName) || [];
    if (listeners.length === 0) {
      if (eventName !== 'error') return;
      throw new Error('Unhandled error');
    }
    if (!listeners) return Promise.resolve();
    const promises = listeners.map(async (fn) => fn(value));

    if (this.#onceToRemove.length) {
      for (const removeData of this.#onceToRemove) {
        this.off(...removeData);
      }
      this.#onceToRemove = [];
    }

    return Promise.all(promises).then(() => undefined);
  }

  on(eventName, listener) {
    this.#checkDuplicateListener(eventName, listener);
    let listeners = this.#events.get(eventName);
    if (listeners) {
      listeners.push(listener);
    } else {
      listeners = [listener];
      this.#events.set(eventName, listeners);
    }
    if (listeners.length > this.#maxListeners) {
      throw new Error(
        `MaxListenersExceededWarning: Possible memory leak. ` +
          `Current maxListeners is ${this.#maxListeners}.`,
      );
    }
  }

  once(eventName, listener) {
    this.#checkDuplicateListener(eventName, listener);
    const wrapper = (...args) => {
      const result = listener(...args);
      this.#onceToRemove.push([eventName, listener]);
      return result;
    };

    this.on(eventName, wrapper);

    let onceWrappersMap = this.#onceWrappersMap.get(eventName);
    if (!onceWrappersMap) {
      onceWrappersMap = new Map();
      this.#onceWrappersMap.set(eventName, onceWrappersMap);
    }
    onceWrappersMap.set(listener, wrapper);
  }

  off(eventName, listener) {
    if (!listener) return void this.clear(eventName);

    const listenerWrapper = this.#onceWrappersMap.get(eventName)?.get(listener);
    const currentListener = listenerWrapper || listener;
    const listeners = this.#events.get(eventName) || [];
    const listenerIndex = listeners.indexOf(currentListener);

    if (listenerIndex > -1) listeners.splice(listenerIndex, 1);

    if (listenerWrapper) {
      this.#onceWrappersMap.get(eventName)?.delete(listener);
    }
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
      this.#onceWrappersMap.clear();
      return;
    }
    this.#events.delete(eventName);
    this.#onceWrappersMap.delete(eventName);
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
    const names = new Set(this.#events.keys());
    return Array.from(names);
  }

  #checkDuplicateListener(eventName, listener) {
    const hasEvent = this.#events.get(eventName)?.includes(listener);
    if (!hasEvent) return;
    const hasWrapper this.#onceWrappersMap.get(eventName)?.get(listener);
    if (!hasWrapper) return;
    throw new Error('Duplicate listeners detected');
  }
}

module.exports = { Emitter };
