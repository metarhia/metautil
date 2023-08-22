'use strict';

const random = (min, max) => {
  const [a, b] = max === undefined ? [0, min] : [min, max];
  return a + Math.floor(Math.random() * (b - a + 1));
};

const sample = (array) => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

const shuffle = (array) => {
  // Based on the algorithm described here:
  // https://en.wikipedia.org/wiki/Fisher-Yates_shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

module.exports = { random, sample, shuffle };
