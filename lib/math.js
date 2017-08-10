'use strict';

const random = (
  // Generate random int in given range
  min, // number, range start
  max // number, range end
  // Returns: number
) => {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return min + Math.floor(Math.random() * (max - min + 1));
};

module.exports = {
  random,
};
