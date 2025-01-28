'use strict';

class EventEmitter {
  constructor(options = {}) {
    this.events = new Map();
    this.wrappers = new Map();
    this.maxListeners = options.maxListeners ?? 10;
  }

  emit(eventName, ...args) {
    const listeners = this.events.get(eventName);
    if (!listeners) return Promise.resolve();
    const { size } = listeners;
    const promises = new Array();
    const callbacks = Array.from(listeners);
    for (let index = 0; index < size; index++) {
      promises[index] = callbacks[index](...args);
    }
    return Promise.all(promises).then(() => undefined);
  }

  on(eventName, listener) {
    const { events, maxListeners } = this;
    const event = events.get(eventName);
    const listeners = event ?? new Set();
    listeners.add(listener);
    if (!event) events.set(eventName, listeners);
    if (listeners.size <= maxListeners) return;
    const title = 'MaxListenersExceededWarning';
    const warn = 'Possible EventEmitter memory leak detected';
    const max = `Current maxListeners is ${maxListeners}`;
    const hint = 'Hint: avoid adding listeners in loops';
    console.warn(`${title}: ${warn}. ${max}. ${hint}`);
  }

  once(eventName, listener) {
    const wrapper = (...args) => {
      this.off(eventName, wrapper);
      return listener(...args);
    };
    wrapper.origin = listener;
    this.on(eventName, wrapper);
    this.wrappers.set(listener, wrapper);
  }

  off(eventName, listener) {
    if (!listener) return void this.clear(eventName);
    const listeners = this.events.get(eventName);
    if (!listeners) return;
    listeners.delete(listener);
    const wrapped = this.wrappers.get(listener);
    if (wrapped) {
      listeners.delete(wrapped);
      this.wrappers.delete(listener);
    }
    if (listeners.size === 0) this.events.delete(eventName);
  }

  toPromise(eventName, options = {}) {
    const { signal = null } = options;
    return new Promise((resolve, reject) => {
      if (!signal) {
        return void this.once(eventName, (...args) => void resolve(args));
      }
      let onAbort = null;
      const onSuccess = (...args) => {
        signal.removeEventListener('abort', onAbort);
        resolve(args);
      };
      onAbort = () => {
        this.off(eventName, onSuccess);
        const message = 'The operatopn was aborted';
        reject(new Error(message, { cause: signal.reason }));
      };
      this.once(eventName, onSuccess);
      signal.addEventListener('abort', onAbort);
    });
  }

  toIterator(eventName, options = {}) {
    const { signal = null } = options;
    const next = () => {
      const promise = this.toPromise(eventName, { signal });
      return promise.then((value) => ({ done: false, value }));
    };
    return { [Symbol.asyncIterator]: () => ({ next }) };
  }

  clear(eventName) {
    const { events, wrappers } = this;
    if (!eventName) {
      events.clear();
      return void wrappers.clear();
    }
    const listeners = events.get(eventName);
    if (!listeners) return;
    for (const listener of listeners) {
      wrappers.delete(listener);
    }
    events.delete(eventName);
  }

  listeners(eventName) {
    const result = [];
    if (!eventName) {
      const eventNames = this.events.keys();
      for (const name of eventNames) {
        const fns = this.listeners(name);
        result.push(...fns);
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
      const listeners = [...this.events.values()];
      return listeners.reduce((total, cur) => total + cur.size, 0);
    }
    const listeners = this.events.get(eventName);
    return listeners ? listeners.size : 0;
  }

  eventNames() {
    return [...this.events.keys()];
  }
}

module.exports = { EventEmitter };
