'use strict';

const { EventEmitter } = require('events');

const emitter = (
  // EventEmitter with wildcard
  // Returns: EventEmitter instance
) => {
  const ee = new EventEmitter();
  const emit = ee.emit;
  ee.emit = (...args) => {
    const ar = args.slice(0);
    ar.unshift('*');
    emit.apply(ee, ar);
    emit.apply(ee, args);
  };
  return ee;
};

const forwardEvent = (
  // Forward an event from one EventEmitter to another.
  from, // EventEmitter to listen for event
  to, // EventEmitter to emit event on
  event, // event name
  newEvent = event // forwarded event name (optional)
) => {
  from.on(event, (...args) => {
    to.emit(newEvent, ...args);
  });
};

const forwardEvents = (
  // Forward events from one EventEmitter to another.
  from, // EventEmitter to listen for event
  to, // EventEmitter to emit event on
  events // array of event names
) => {
  events.forEach((event) => {
    forwardEvent(from, to, event);
  });
};

module.exports = {
  emitter,
  forwardEvent,
  forwardEvents,
};
