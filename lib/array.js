'use strict';

const splitAt = (
  // Splits array into two parts
  index, // number, index defining end of first part and start of second
  array // array, to be splitted
  // Returns: tuple with two parts of the array
) => {
  const part1 = array.slice(0, index);
  const part2 = array.slice(index, array.length);
  return [part1, part2];
};

const shuffle = (
  // Shuffle an array
  arr // array
  // Returns: array
) => (
  arr.sort(() => Math.random() - 0.5)
);

const range = (
  // Generate int array from given range
  from, // naumber, range start
  to // naumber, range end
  // Returns: array
  // Example: `range(1, 5) = [1, 2, 3, 4, 5]`
) => {
  if (to < from) return [];
  const len = to - from + 1;
  const range = new Array(len);
  let i;
  for (i = from; i <= to; i++) {
    range[i - from] = i;
  }
  return range;
};

const sequence = (
  // Generate int array from sequence syntax
  seq, // array
  max // number, optional max
  // Returns: array
  // Example:
  // list: sequence([81, 82, 83]) = [81, 82, 83]
  // range from..to: sequence([81,,83]) = [81, 82, 83]
  // range from..count: sequence([81, [3]]) = [81, 82, 83]
  // range from..max-to: sequence([81, [-2]], 5) = [81, 82, 83]
) => {
  const from = seq[0];
  let to = seq[1];
  let res = seq;
  if (Array.isArray(to)) {
    const count = to[0] < 0 ? max + to[0] : to[0];
    res = range(from, from + count - 1);
  } else if (!to) {
    to = seq[2];
    res = range(from, to);
  }
  return res;
};

const last = (
  // Last array element
  arr // array
  // Returns: element
) => (
  arr[arr.length - 1]
);

module.exports = {
  splitAt,
  shuffle,
  range,
  sequence,
  last,
};
