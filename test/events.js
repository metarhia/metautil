'use strict';

const metatests = require('metatests');
const events = require('events');
const common = require('..');

metatests.test('emitter', test => {
  const ee = common.emitter();
  ee.on('name', () => {
    test.end();
  });
  ee.emit('name');
});

metatests.test('forward all events', test => {
  test.plan(3);

  const sourceEmitter = common.emitter();
  const targetEmitter = common.emitter();

  common.forwardEvents(sourceEmitter, targetEmitter);

  targetEmitter.on('testEvent1', () => {
    test.pass('event #1');
  });

  targetEmitter.on('testEvent2', () => {
    test.pass('event #2');
  });

  targetEmitter.on('testEvent3', () => {
    test.pass('event #3');
  });

  sourceEmitter.emit('testEvent1');
  sourceEmitter.emit('testEvent2');
  sourceEmitter.emit('testEvent3');
});

metatests.test('forward all events by method', test => {
  test.plan(3);

  const sourceEmitter = common.emitter();
  const targetEmitter = common.emitter();

  sourceEmitter.forward(targetEmitter);

  targetEmitter.on('testEvent1', () => {
    test.pass('event #1');
  });

  targetEmitter.on('testEvent2', () => {
    test.pass('event #2');
  });

  targetEmitter.on('testEvent3', () => {
    test.pass('event #3');
  });

  sourceEmitter.emit('testEvent1');
  sourceEmitter.emit('testEvent2');
  sourceEmitter.emit('testEvent3');
});

metatests.test('forward a single event', test => {
  test.plan(1);

  const sourceEventEmitter = new events.EventEmitter();
  const targetEventEmitter = new events.EventEmitter();

  common.forwardEvents(sourceEventEmitter, targetEventEmitter, 'testEvent');

  targetEventEmitter.on('testEvent', () => {
    test.pass('event handler must be called');
  });

  sourceEventEmitter.emit('testEvent');
});

metatests.test('forward a single event under a new name', test => {
  test.plan(1);

  const sourceEventEmitter = new events.EventEmitter();
  const targetEventEmitter = new events.EventEmitter();

  common.forwardEvents(sourceEventEmitter, targetEventEmitter, {
    testEvent: 'renamedEvent',
  });

  targetEventEmitter.on('renamedEvent', () => {
    test.pass('event handler must be called');
  });

  sourceEventEmitter.emit('testEvent');
});

metatests.test('forward multiple events', test => {
  test.plan(2);

  const sourceEventEmitter = new events.EventEmitter();
  const targetEventEmitter = new events.EventEmitter();

  common.forwardEvents(sourceEventEmitter, targetEventEmitter, [
    'event1',
    'event2',
  ]);

  targetEventEmitter.on('event1', () => {
    test.pass('first event handler must be called');
  });

  targetEventEmitter.on('event2', () => {
    test.pass('second event handler must be called');
  });

  sourceEventEmitter.emit('event1');
  sourceEventEmitter.emit('event2');
});
