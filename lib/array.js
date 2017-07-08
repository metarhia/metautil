'use strict';

const splitAt = (
  // Splits array into two parts
  index, // index defining end of first part and start of second
  array // array which is splitting
  // Returns tuple with two parts of the array
) => {
  const part1 = array.slice(0, index);
  const part2 = array.slice(index, array.length);
  return [part1, part2];
};

module.exports = {
  splitAt
};
