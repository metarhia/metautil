'use strict';

const util = require('util');
const { EventEmitter } = require('events');

const forwardEvent = (
  // Forward an event from one EventEmitter to another
  from, // EventEmitter, to listen for event
  to, // EventEmitter, to emit event on
  event, // string, event name
  newEvent = event // string (optional), forwarded event name
) => {
  if (event === '*') {
    from.on(event, (eventName, ...args) => {
      to.emit(eventName, ...args);
    });
  } else {
    from.on(event, (...args) => {
      to.emit(newEvent, ...args);
    });
  }
};

const forwardEvents = (
  // Forward events from one EventEmitter to another
  from, // EventEmitter, to listen for event
  to, // EventEmitter, to emit event on
  events // array of string, event names
  // Example: common.forwardEvent(from, to);
  // Example: common.forwardEvent(from, to, 'eventName');
  // Example: common.forwardEvent(from, to, { eventName: 'newEventName' });
  // Example: common.forwardEvent(from, to, ['eventName1', 'eventName2']);
) => {
  if (!events) {
    forwardEvent(from, to, '*');
    return;
  }
  if (typeof(events) === 'string') {
    forwardEvent(from, to, events);
    return;
  }
  let event;
  if (Array.isArray(events)) {
    for (event of events) {
      forwardEvent(from, to, event);
    }
    return;
  }
  for (event in events) {
    forwardEvent(from, to, event, events[event]);
  }
};

function EnhancedEmitter() {
  EventEmitter.call(this);
}

util.inherits(EnhancedEmitter, EventEmitter);

const emit = EventEmitter.prototype.emit;

EnhancedEmitter.prototype.emit = function(...args) {
  emit.call(this, '*', ...args);
  emit.call(this, ...args);
};

EnhancedEmitter.prototype.forward = function(to, events) {
  forwardEvents(this, to, events);
};

const emitter = (
  // Enhanced EventEmitter with wildcard
  // Returns: EventEmitter, instance
) => (new EnhancedEmitter());

module.exports = {
  forwardEvents,
  emitter,
};
