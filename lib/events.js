'use strict';

class EventIterator {
  #resolvers = [];
  #emitter = null;
  #eventName = '';
  #listener = null;
  #done = false;

  constructor(emitter, eventName) {
    this.#emitter = emitter;
    this.#eventName = eventName;
    this.#listener = (value) => {
      const resolvers = this.#resolvers;
      if (resolvers.length === 0) return;
      const resolve = resolvers.shift();
      resolve({ done: false, value });
    };
    emitter.on(eventName, this.#listener);
  }

  next() {
    return new Promise((resolve) => {
      if (this.#done) resolve({ done: false, value: undefined });
      else this.#resolvers.push(resolve);
    });
  }

  async return() {
    if (!this.#done) {
      this.#done = true;
      this.#emitter.off(this.#eventName, this.#listener);
    }
    return { done: true, value: undefined };
  }

  async throw() {
    this.return();
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

  toAsyncIterable(eventName) {
    return new EventIterable(this, eventName);
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
