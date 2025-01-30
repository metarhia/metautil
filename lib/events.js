'use strict';

const createIteratorStep = (step) => {
  const { data } = step;
  if (data.done) {
    return Promise.resolve(data);
  }
  if (data.value) {
    step.data.value = undefined;
    return Promise.resolve(data);
  }
  step.pending = true;
  return new Promise((resolve, reject) => {
    step.promise = { resolve, reject };
  });
};

class EventIterator {
  constructor(context, step) {
    const { handleClean, handleError } = context;
    return {
      next() {
        return createIteratorStep(step);
      },

      return() {
        handleClean();
        return Promise.resolve(step.data);
      },

      throw(err) {
        handleError(err);
        return Promise.reject(err);
      },
    };
  }
}

class EventIterable {
  constructor(emitter, eventName) {
    const step = {
      pending: false,
      promise: null,
      data: {
        value: undefined,
        done: false,
      },
    };
    const handleEvent = (value) => {
      if (step.pending) {
        step.pending = false;
        const { done } = step.data;
        step.promise.resolve({ value, done });
      } else {
        step.data.value = value;
      }
    };
    const context = {
      handleError: (err) => {
        if (step.pending) {
          step.pending = false;
          step.promise.reject(err);
        }
        context.handleClean();
      },
      handleClean: () => {
        emitter.off(eventName, handleEvent);
        emitter.off('error', context.handleError);
        step.data.value = undefined;
        step.data.done = true;
        if (step.pending) {
          step.pending = false;
          step.promise.resolve(step.data);
        }
      },
    };
    emitter.on(eventName, handleEvent);
    emitter.on('error', context.handleError);
    return {
      [Symbol.asyncIterator]() {
        return new EventIterator(context, step);
      },
    };
  }
}

class EventEmitter {
  constructor(options = {}) {
    this.events = new Map();
    this.maxListeners = options.maxListeners || 10;
  }

  emit(name, ...args) {
    const listeners = this.events.get(name);
    if (!listeners) return null;
    const promises = listeners.map((fn) => fn(...args));
    return Promise.all(promises);
  }

  on(name, fn) {
    const listeners = this.events.get(name);
    if (!listeners) return void this.events.set(name, [fn]);
    if (listeners.includes(fn)) {
      console.warn(`Duplicate listeners detected: ${fn.name}`);
    }
    listeners.push(fn);
    const tooManyListeners = listeners.size > this.maxListeners;
    if (tooManyListeners) {
      const name = 'MaxListenersExceededWarning';
      const warn = 'Possible EventEmitter memory leak detected';
      const max = `Current maxListenersCount is ${this.maxListeners}`;
      const hint = 'Hint: avoid adding listeners in loops';
      console.warn(`${name}: ${warn}. ${max}. ${hint}`);
    }
  }

  once(name, fn) {
    const dispose = (...args) => {
      this.off(name, dispose);
      return void fn(...args);
    };
    this.on(name, dispose);
  }

  off(name, fn) {
    const listeners = this.events.get(name);
    if (!listeners) return;
    const index = listeners.indexOf(fn);
    listeners.splice(index, 1);
    if (listeners.length === 0) {
      this.events.delete(name);
    }
  }

  toPromise(name) {
    return new Promise((resolve) => {
      this.once(name, resolve);
    });
  }

  toAsyncIterable(name) {
    return new EventIterable(this, name);
  }

  clear(name) {
    if (!name) return void this.events.clear();
    this.events.delete(name);
  }

  listeners(name) {
    return this.events.get(name) || [];
  }

  listenerCount(name) {
    const listeners = this.events.get(name);
    if (listeners) return listeners.length;
    return 0;
  }

  eventNames() {
    return Array.from(this.events.keys());
  }
}

module.exports = { EventEmitter };
