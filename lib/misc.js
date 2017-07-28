'use strict';

const { either } = require('./functional');

const falseness = (
  // Empy function
  // Returns: Boolean always false
) => false;

const trueness = (
  // Empy function
  // Returns: Boolean always true
) => true;

const emptiness = (
  // Empy function
  // Returns: always undefined
) => {};

const nop = (
  // Empy asynchronous callback-last single-argument function
  callback // callback to be called with (null)
) => {
  callback(null);
};

const noop = (
  // Empy asynchronous callback-last double-argument function
  empty, // incoming value to be ignored
  callback // callback to be called with (null, null)
) => {
  callback(null, null);
};

const cb = (
  // Wrap callback: call once, not null
  callback // function (optional)
  // Returns: wrapped callback
) => {
  if (!callback) return emptiness;
  let finished = false;
  const wrap = (...args) => {
    if (finished) return;
    finished = true;
    callback(...args);
  };
  return wrap;
};

const cbExtract = (
  // Exctracts callback and wraps it with common.cb
  // callback is last argument if it's function
  // otherwise it's common.falseness
  args // arguments
  // Returns: wrapped callback
) => {
  const callback = args[args.length - 1];
  if (typeof(callback) !== 'function') return emptiness;

  args.pop();
  return cb(callback);
};

const override = (
  // Override method: save old to `fn.inherited`
  obj, // Object containing method to override
  fn // function, name will be used to find method
  // Previous function will be accessible by obj.fnName.inherited
) => {
  fn.inherited = obj[fn.name];
  obj[fn.name] = fn;
};

const range = (
  // Generate int array from given range
  from, // range start
  to // range end
  // Returns: array
  // Example: range(1, 5) = [1, 2, 3, 4, 5]
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
  seq, // Array
  max // optional max
  // Returns: Array
  // Examples:
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

const shuffle = (
  // Shuffle an array
  arr // array
  // Returns: array
) => (
  arr.sort(() => Math.random() - 0.5)
);

const restLeft = (
  // Rest left, transfor function
  fn // (args, arg1..argN, callback) to (arg1..argN, ...args, callback)
  // Returns: function to pass arguments for `fn`
) => (...spreadArgs) => {
  const callback = cbExtract(spreadArgs);
  const namedArgsCount = fn.length - 2;
  const namedArgs = spreadArgs.slice(0, namedArgsCount);
  const args = spreadArgs.slice(namedArgsCount);
  fn(args, ...namedArgs, callback);
};

const requireEither = either(require);

module.exports = {
  falseness,
  trueness,
  emptiness,
  nop,
  noop,
  cb,
  cbExtract,
  override,
  range,
  sequence,
  random,
  shuffle,
  restLeft,
  requireEither
};
