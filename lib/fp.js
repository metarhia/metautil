'use strict';

const { safeCallback } = require('./callbacks');

const partial = (
  // Partially apply arguments to function
  fn, // function
  ...args // array, argumants
  // Returns: function
) => (...rest) => fn(...args.concat(rest));

const omap = (
  // Map object fields with provided function
  mapFn, // funtion, to appy to every field value
  obj // object, which fields used for mapping
  // Returns: object, with same reference but with transformed fields
) => {
  for (const key in obj) {
    obj[key] = mapFn(obj[key]);
  }
  return obj;
};

const compose = (
  // Compose multiple functions into one
  ...fns // array of functions
  // Returns: function, composed
) => (
  ...args // arguments to be passed to first function
) => {
  if (fns.length === 0) return args[0];

  let res = fns[0](...args);
  for (let i = 1; i < fns.length; i++) {
    res = fns[i](res);
  }
  return res;
};

const maybe = (
  // Apply given function to value or default value
  fn, // function
  defVal, // default value
  value // value (optional)
  // Returns: result of `fn` or `defVal`
) => (
  value !== undefined && value !== null ? fn(value) : defVal
);

const zip = (
  // Zip several arrays into one
  ...arrays // array of arrays,
  // Returns: array, length is minimal of input arrays length
  // Element with index i of resulting array is array with
  // elements with index i from input arrays
) => {
  if (arrays.length === 0) return arrays;

  let minLen = arrays[0].length;
  for (let i = 1; i < arrays.length; i++) {
    minLen = Math.min(arrays[i].length, minLen);
  }

  const res = new Array(minLen);
  for (let i = 0; i < res.length; i++) {
    res[i] = new Array(arrays.length);
    for (let j = 0; j < res[i].length; j++) {
      res[i][j] = arrays[j][i];
    }
  }
  return res;
};

const replicate = (
  // Create array of replicated values
  count, // number, new array length
  elem // value to replicate
  // Returns: array, replicated
) => (Array.from({ length: count }, () => elem));

const zipWith = (
  // Zip arrays using specific function
  fn, // function, for zipping elements with index i
  ...arrays // array of arrays
  // Returns: array
  // Element with index i of resulting array is result
  // of fn called with arguments from arrays
) => zip(...arrays).map(args => fn(...args));

const curryUntil = (
  // Curry function until the condition is met
  condition, // function, (argsI, argsParts) returns boolean
  // argsI is arguments for i-th currying
  // argsParts is array of args given for currying from first to i-th currying
  fn, // function, which will be curried
  ...args // array, arguments for fn
  // Returns: function, curried
) => {
  const argsParts = [];

  const curryMore = (...argsI) => {
    argsParts.push(argsI);
    if (condition(argsI, argsParts)) {
      const allArgs = [].concat(...argsParts);
      return fn(...allArgs);
    }
    return curryMore;
  };

  return curryMore(...args);
};

const curry = (
  // Curry function with given arguments
  fn, // function
  ...args // array, arguments
  // Returns: function, curried
) => {
  let argsTotalCount = 0;
  const condition = (argsI) => (
    argsTotalCount += argsI.length,
    argsTotalCount >= fn.length
  );
  return curryUntil(condition, fn, ...args);
};

const curryN = (
  // Curry fn count times, first curry uses args for first currying
  fn, // function, curried
  count, // number, of times function should be curried
  ...args // array, arguments for first currying
  // Returns: function, curried given times count
) => {
  let i = -1;
  const condition = () => (i++, i === count);
  return curryUntil(condition, fn, ...args);
};

const curryTwice = (
  // Curry function curry with fn
  fn // function, to be curried
  // Returns: function, to pass arguments that returns curried fn
) => curry(curry, fn);

const applyArgs = (
  // Apply arguments
  ...args // array, arguments to save in closure
  // Returns: function, to pass (fn) arguments will be applied
) => fn => fn(...args);

const either = (
  // Get first not errored result of fn
  fn // function, to be called
  // Returns: result of `fn`
) => (
  ...args // arguments to iterate
) => {
  let lastError;
  for (const arg of args) {
    try {
      return fn(arg);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};

const restLeft = (
  // Rest left, transform function
  fn // function, (args, arg1..argN, callback)
  // Returns: function, (arg1..argN, ...args, callback)
) => (...spreadArgs) => {
  const callback = safeCallback(spreadArgs);
  const namedArgsCount = fn.length - 2;
  const namedArgs = spreadArgs.slice(0, namedArgsCount);
  const args = spreadArgs.slice(namedArgsCount);
  fn(args, ...namedArgs, callback);
};

module.exports = {
  partial,
  omap,
  compose,
  maybe,
  zip,
  replicate,
  zipWith,
  curryUntil,
  curryN,
  curryTwice,
  curry,
  applyArgs,
  either,
  restLeft,
};
