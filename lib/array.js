'use strict';

// Split array into two parts
//   index - <number>, index defining end of first part and start of second
//   array - <Array>, to be split
// Returns: <Array>, tuple with two parts of the array
const splitAt = (index, array) => {
  const part1 = array.slice(0, index);
  const part2 = array.slice(index, array.length);
  return [part1, part2];
};

// Shuffle an array
//   arr - <Array>
// Returns: <Array>
const shuffle = arr => {
  // Based on the algorithm described here:
  // https://en.wikipedia.org/wiki/Fisher-Yates_shuffle
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Random element from array
//   arr - <Array>
// Returns: <any>
const sample = arr => arr[Math.floor(Math.random() * arr.length)];

// Generate int array from given range
//   from - <number>, range start
//   to - <number>, range end
// Returns: <Array>
//
// Example: range(1, 5)
// Result: [1, 2, 3, 4, 5]
const range = (from, to) => {
  if (to < from) return [];
  const len = to - from + 1;
  const range = new Array(len);
  for (let i = from; i <= to; i++) {
    range[i - from] = i;
  }
  return range;
};

// Generate int array from sequence syntax
// Signature: seq[, max]
//   seq - <Array>
//   max - <number>, (optional), max
// Returns: <Array>
//
// Example: list: sequence([81, 82, 83])
// Result: [81, 82, 83]
// Example: range from..to: sequence([81,,83]) = [81, 82, 83]
// Result: [81, 82, 83]
// Example: range from..count: sequence([81, [3]]) = [81, 82, 83]
// Result: [81, 82, 83]
// Example: range from..max-to: sequence([81, [-2]], 5) = [81, 82, 83]
// Result: [81, 82, 83]
const sequence = (seq, max) => {
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

// Get last element of array
//   arr - <Array>
// Returns: <any>, element
const last = arr => arr[arr.length - 1];

// Push single value multiple times
//   arr - <Array>
//   n - <number>
//   value - <any>
// Returns: <number>, new value of arr.length
const pushSame = (arr, n, value) => {
  if (n <= 0) return arr.length;
  const from = arr.length;
  arr.length += n;
  for (let i = from; i < arr.length; i++) {
    arr[i] = value;
  }
  return arr.length;
};

module.exports = {
  splitAt,
  shuffle,
  sample,
  range,
  sequence,
  last,
  pushSame,
};
