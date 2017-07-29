'use strict';

const util = require('util');
const { EventEmitter } = require('events');

function EnhancedEmitter() {
  EventEmitter.call(this);
}

util.inherits(EnhancedEmitter, EventEmitter);

const emit = EventEmitter.prototype.emit;

EnhancedEmitter.prototype.emit = function(...args) {
  emit.call(this, '*', ...args);
  emit.call(this, ...args);
};

const emitter = (
  // Enhanced EventEmitter with wildcard
  // Returns: EventEmitter instance
) => (new EnhancedEmitter());

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
