'use strict';

const random = (min, max) => {
  const [a, b] = max === undefined ? [0, min] : [min, max];
  return a + Math.floor(Math.random() * (b - a + 1));
};

const sample = (arr) => {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
};

module.exports = { random, sample };
