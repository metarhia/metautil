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

  listenerCount(name) {
    const listeners = this.events.get(name);
    return listeners ? listeners.size : 0;
  }

  on(name, fn) {
    const { events, maxListenersCount } = this;
    if (!events.has(name)) events.set(name, new Set());
    const listeners = this.events.get(name);
    listeners.add(fn);
    if (listeners.size <= maxListenersCount) return;
    const title = 'MaxListenersExceededWarning';
    const warn = 'Possible EventEmitter memory leak detected';
    const max = `Current maxListenersCount is ${maxListenersCount}`;
    const hint = 'Hint: avoid adding listeners in loops';
    console.warn(`${title}: ${warn}. ${max}. ${hint}`);
  }

  once(name, fn) {
    if (!this.wrappers.has(name)) this.wrappers.set(name, new Map());
    const wrapper = (...args) => {
      this.off(name, wrapper);
      fn(...args);
    };
    this.on(name, wrapper);
    const callbacks = this.wrappers.get(name);
    callbacks.set(fn, wrapper);
  }

  emit(name, ...args) {
    const listeners = this.events.get(name);
    if (!listeners) return;
    for (const fn of listeners) fn(...args);
  }

  off(name, fn) {
    const listeners = this.events.get(name);
    if (!listeners) return;
    listeners.delete(fn);
    const callbacks = this.wrappers.get(name);
    if (callbacks && callbacks.has(fn)) {
      listeners.delete(callbacks.get(fn));
      callbacks.delete(fn);
      if (callbacks.size === 0) this.wrappers.delete(name);
    }
    if (listeners.size === 0) this.events.delete(name);
  }

  clear(name) {
    if (!name) {
      this.events.clear();
      return void this.wrappers.clear();
    }
    this.events.delete(name);
    this.wrappers.delete(name);
  }
}

const once = (emitter, name) =>
  new Promise((resolve) => {
    emitter.once(name, resolve);
  });

module.exports = { EventEmitter, once };
