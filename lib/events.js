'use strict';

const { EventEmitter } = require('events');

// Forward an event from one EventEmitter to another
// Signature: from, to, event[, newEvent]
//   from - <EventEmitter>, to listen for event
//   to - <EventEmitter>, to emit event on
//   event - <string>, event name
//   newEvent - <string>, (optional), default: `event`, forwarded event name
const forwardEvent = (from, to, event, newEvent = event) => {
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

// Forward events from one EventEmitter to another
// Signature: from, to[, events]
//   from - <EventEmitter>, to listen for event
//   to - <EventEmitter>, to emit event on
//   events - <string> | <Object> | <string[]>, (optional), events names
//
// Example: forwardEvents(from, to);
// Example: forwardEvents(from, to, 'eventName');
// Example: forwardEvents(from, to, { eventName: 'newEventName' });
// Example: forwardEvents(from, to, ['eventName1', 'eventName2']);
const forwardEvents = (from, to, events) => {
  if (!events) {
    forwardEvent(from, to, '*');
    return;
  }
  if (typeof events === 'string') {
    forwardEvent(from, to, events);
    return;
  }
  if (Array.isArray(events)) {
    for (const event of events) {
      forwardEvent(from, to, event);
    }
    return;
  }
  for (const event in events) {
    forwardEvent(from, to, event, events[event]);
  }
};

class EnhancedEmitter extends EventEmitter {
  // Call listener with provided arguments
  // Signature: ...args
  //   args - <Array>, arguments to be passed
  emit(...args) {
    super.emit('*', ...args);
    super.emit(...args);
  }

  // Forward events from one EventEmitter to another
  //   to - <EventEmitter>, to emit event on
  //   events - <string> | <Object> | <string[]>, events names
  forward(to, events) {
    forwardEvents(this, to, events);
  }
}

// Create EnhancedEmitter, enhanced EventEmitter
// with wildcard and forward method
// Returns: <EventEmitter>
const emitter = () => new EnhancedEmitter();

module.exports = {
  forwardEvents,
  emitter,
  EnhancedEmitter,
};
