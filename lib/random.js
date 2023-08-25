'use strict';

const random = (min, max) => {
  const [a, b] = max === undefined ? [0, min] : [min, max];
  return a + Math.floor(Math.random() * (b - a + 1));
};

const sample = (array, random = Math.random) => {
  const index = Math.floor(random() * array.length);
  return array[index];
};

const shuffle = (array, random = Math.random) => {
  // Based on the algorithm described here:
  // https://en.wikipedia.org/wiki/Fisher-Yates_shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

module.exports = { random, sample, shuffle };
