'use strict';

class EventEmitter {
  constructor() {
    this.events = new Map();
    this.wrappers = new Map();
    this.maxListenersCount = 10;
  }

  listenerCount(eventName) {
    if (!eventName) {
      const listeners = [...this.events.values()];
      return listeners.reduce((total, cur) => total + cur.size, 0);
    }
    const listeners = this.events.get(eventName);
    return listeners ? listeners.size : 0;
  }

  on(eventName, listener) {
    const { events, maxListenersCount } = this;
    if (!events.has(eventName)) events.set(eventName, new Set());
    const listeners = this.events.get(eventName);
    listeners.add(listener);
    if (listeners.size <= maxListenersCount) return;
    const title = 'MaxListenersExceededWarning';
    const warn = 'Possible EventEmitter memory leak detected';
    const max = `Current maxListenersCount is ${maxListenersCount}`;
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

  emit(eventName, ...args) {
    const listeners = this.events.get(eventName);
    if (!listeners) return Promise.resolve();
    const promises = [...listeners].map((listener) => listener(...args));
    return Promise.all(promises).then(() => {});
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

  eventNames() {
    return [...this.events.keys()];
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
}

module.exports = { EventEmitter };
