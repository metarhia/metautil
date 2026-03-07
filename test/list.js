'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { List } = require('..');
const createSharedTests = require('./list-shared.js');

createSharedTests(List, 'List');

test('List: constructor pre-allocates but starts empty', () => {
  const list = new List(10);
  assert.strictEqual(list.size, 0);
});
