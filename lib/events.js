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
  #maxListeners = 10;

  constructor(options = {}) {
    this.#maxListeners = options.maxListeners ?? 10;
  }

  emit(eventName, value) {
    const event = this.#events.get(eventName);
    if (!event) {
      if (eventName !== 'error') return Promise.resolve();
      throw new Error('Unhandled error');
    }
    const on = event.on.slice();
    const promises = on.map(async (fn) => fn(value));
    if (event.once.length > 0) {
      const on = new Array(event.on.length);
      let index = 0;
      for (let i = 0, len = event.on.length; i < len; i++) {
        const listener = event.on[i];
        if (!event.once.includes(listener)) on[index++] = listener;
      }
      on.length = index;
      if (index > 0) this.#events.set(eventName, { on, once: [] });
      else this.#events.delete(eventName);
    }
    return Promise.all(promises).then(() => undefined);
  }

  #addListener(eventName, listener, once) {
    let event = this.#events.get(eventName);
    if (!event) {
      event = { on: [listener], once: once ? [listener] : [] };
      this.#events.set(eventName, event);
    } else {
      if (event.on.includes(listener)) {
        throw new Error('Duplicate listeners detected');
      }
      event.on.push(listener);
      if (once) event.once.push(listener);
    }
    if (event.on.length > this.#maxListeners) {
      throw new Error(
        `MaxListenersExceededWarning: Possible memory leak. ` +
          `Current maxListeners is ${this.#maxListeners}.`,
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
    if (!listener) return void this.#events.delete(eventName);
    const event = this.#events.get(eventName);
    if (!event) return;
    const onIndex = event.on.indexOf(listener);
    if (onIndex > -1) event.on.splice(onIndex, 1);
    const onceIndex = event.once.indexOf(listener);
    if (onceIndex > -1) event.once.splice(onceIndex, 1);
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
    if (!eventName) return void this.#events.clear();
    this.#events.delete(eventName);
  }

  listeners(eventName) {
    if (eventName) {
      const event = this.#events.get(eventName);
      return event ? event.on : [];
    }
    const listeners = new Set();
    for (const event of this.#events.values()) {
      for (let i = 0, len = event.on.length; i < len; i++) {
        listeners.add(event.on[i]);
      }
    }
    return Array.from(listeners);
  }

  listenerCount(eventName) {
    if (eventName) {
      const event = this.#events.get(eventName);
      return event ? event.on.length : 0;
    }
    const listeners = new Set();
    for (const event of this.#events.values()) {
      for (let i = 0, len = event.on.length; i < len; i++) {
        listeners.add(event.on[i]);
      }
    }
    return listeners.size;
  }

  eventNames() {
    return Array.from(this.#events.keys());
  }
}

module.exports = { Emitter };
