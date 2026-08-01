'use strict';

const sample = (array, random = Math.random) => {
  const index = Math.floor(random() * array.length);
  return array[index];
};

const shuffle = (array, random = Math.random) => {
  // Based on Fisher-Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

const projection = (source, fields) => {
  const result = {};
  for (const key of fields) {
    if (Object.hasOwn(source, key)) {
      result[key] = source[key];
    }
  }
  return result;
};

module.exports = { sample, shuffle, projection };
