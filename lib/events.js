'use strict';

class EventEmitter {
  constructor() {
    this.events = new Map();
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
    const listeners = this.events.get(name);
    if (!listeners) return void this.events.set(name, new Set([fn]));
    listeners.add(fn);
    if (listeners.size <= this.maxListenersCount) return;
    const title = 'MaxListenersExceededWarning';
    const warn = 'Possible EventEmitter memory leak detected';
    const max = `Current maxListenersCount is ${this.maxListenersCount}`;
    const hint = 'Hint: avoid adding listeners in loops';
    console.warn(`${title}: ${warn}. ${max}. ${hint}`);
  }

  once(name, fn) {
    const dispose = (...args) => {
      this.remove(name, dispose);
      return void fn(...args);
    };
    this.on(name, dispose);
  }

  emit(name, ...args) {
    const listeners = this.events.get(name);
    if (!listeners) return;
    for (const fn of listeners) fn(...args);
  }

  remove(name, fn) {
    const listeners = this.events.get(name);
    if (!listeners) return;
    listeners.delete(fn);
  }

  clear(name) {
    if (!name) return void this.events.clear();
    this.events.delete(name);
  }
}

const once = (emitter, name) =>
  new Promise((resolve) => {
    emitter.once(name, resolve);
  });

module.exports = { EventEmitter, once };
