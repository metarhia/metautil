'use strict';

const { Stream } = require('./lib/events.js');

const stream = new Stream();

stream.push('Push data to stream');
stream.push('Push data to stream 2');
stream.push('Push data to stream 3');
stream.push(null);

const readableToEmitter = stream.toEventEmitter('data');
const iterable = readableToEmitter.toAsyncIterable('data');
const readable = Stream.from(iterable);

readable.on('data', (chunk) => {
  console.log('readable: chunk:' + chunk);
  return chunk;
});
readableToEmitter.on('data', (chunk) => {
  console.log('readableToEmitter: chunk:' + chunk);
});

readableToEmitter.on('error', (error) => {
  console.log('readableToEmitter: error:' + error);
});

readableToEmitter.on('end', () => {
  console.log('readableToEmitter: end');
});

(async () => {
  await readableToEmitter.emit('data', 'For stream data');
  await readableToEmitter.emit('data', 'For stream data 2');
})();
