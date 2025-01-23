'use strict';

class EventEmitter {
  constructor() {
    this.events = new Map();
    this.wrappers = new Map();
    this.maxListenersCount = 10;
  }

  getMaxListeners() {
    return this.maxListenersCount;
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
    const { wrappers } = this;
    if (!wrappers.has(eventName)) wrappers.set(eventName, new Map());
    const wrapper = (...args) => {
      this.off(eventName, wrapper);
      return listener(...args);
    };
    this.on(eventName, wrapper);
    const callbacks = this.wrappers.get(eventName);
    callbacks.set(listener, wrapper);
  }

  emit(eventName, ...args) {
    const listeners = this.events.get(eventName);
    if (!listeners) return Promise.resolve();
    const promises = [...listeners].map((listener) => listener(...args));
    return Promise.all(promises).then(() => {});
  }

  off(eventName, listener) {
    const listeners = this.events.get(eventName);
    if (!listeners) return;
    listeners.delete(listener);
    const callbacks = this.wrappers.get(eventName);
    if (callbacks && callbacks.has(listener)) {
      listeners.delete(callbacks.get(listener));
      callbacks.delete(listener);
      if (callbacks.size === 0) this.wrappers.delete(eventName);
    }
    if (listeners.size === 0) this.events.delete(eventName);
  }

  clear(eventName) {
    if (!eventName) {
      this.events.clear();
      return void this.wrappers.clear();
    }
    this.events.delete(eventName);
    this.wrappers.delete(eventName);
  }

  toPromise(eventName) {
    return new Promise((resolve) => {
      this.once(eventName, (...args) => resolve(args));
    });
  }

  toIterator(eventName) {
    const next = async () => {
      const value = await this.toPromise(eventName);
      return { done: false, value };
    };
    return { [Symbol.asyncIterator]: () => ({ next }) };
  }

  eventNames() {
    return [...this.events.keys()];
  }
}

const once = (emitter, name) =>
  new Promise((resolve) => {
    emitter.once(name, resolve);
  });

module.exports = { EventEmitter, once };
