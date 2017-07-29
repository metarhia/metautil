'use strict';

const tap = require('tap');
const events = require('events');
const common = require('..');

tap.test('forward a single event', (test) => {
  test.plan(1);

  const sourceEventEmitter = new events.EventEmitter();
  const targetEventEmitter = new events.EventEmitter();

  common.forwardEvent(sourceEventEmitter, targetEventEmitter, 'testEvent');

  targetEventEmitter.on('testEvent', () => {
    test.pass('event handler must be called');
  });

  sourceEventEmitter.emit('testEvent');
});

tap.test('forward a single event under a new name', (test) => {
  test.plan(1);

  const sourceEventEmitter = new events.EventEmitter();
  const targetEventEmitter = new events.EventEmitter();

  common.forwardEvent(
    sourceEventEmitter, targetEventEmitter, 'testEvent', 'renamedEvent'
  );

  targetEventEmitter.on('renamedEvent', () => {
    test.pass('event handler must be called');
  });

  sourceEventEmitter.emit('testEvent');
});

tap.test('forward multiple events', (test) => {
  test.plan(2);

  const sourceEventEmitter = new events.EventEmitter();
  const targetEventEmitter = new events.EventEmitter();

  common.forwardEvents(
    sourceEventEmitter, targetEventEmitter, ['event1', 'event2']
  );

  targetEventEmitter.on('event1', () => {
    test.pass('first event handler must be called');
  });

  targetEventEmitter.on('event2', () => {
    test.pass('second event handler must be called');
  });

  sourceEventEmitter.emit('event1');
  sourceEventEmitter.emit('event2');
});
