'use strict';

const random = (
  // Generate random int in given range
  min, // range start
  max // range end
  // Returns: Number
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
