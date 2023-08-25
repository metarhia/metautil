'use strict';

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

const projection = (source, fields) => {
  const entries = [];
  for (const key of fields) {
    if (Object.hasOwn(source, key)) {
      const value = source[key];
      entries.push([key, value]);
    }
  }
  return Object.fromEntries(entries);
};

module.exports = { sample, shuffle, projection };
