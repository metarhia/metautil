'use strict';

const omap = (
  // Function for mapping object fields
  mapFn, // funtions applied to every field value
  obj // object which fields used for mapping
  // Returns: object with same reference but with transformed fields
) => {
  let key;
  for (key in obj) {
    obj[key] = mapFn(obj[key]);
  }
  return obj;
};

const compose = (
  // Compose multiple functions into one
  ...fns // functions
  // Returns: composed function
) => (
  ...args // arguments to bassed to first function
) => {
  if (fns.length === 0) return args[0];

  let res = fns[0](...args);
  let i;
  for (i = 1; i < fns.length; i++) {
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
  // Zipping several arrays into one
  ...arrays // input arrays
  // Returns: array length is minimal of input arrays length
  // Element with index i of resulting array is array with
  // elements with index i from input arrays
) => {
  if (arrays.length === 0) return arrays;
  let i, j;

  let minLen = arrays[0].length;
  for (i = 1; i < arrays.length; i++) {
    minLen = Math.min(arrays[i].length, minLen);
  }

  const res = new Array(minLen);
  for (i = 0; i < res.length; i++) {
    res[i] = new Array(arrays.length);
    for (j = 0; j < res[i].length; j++) {
      res[i][j] = arrays[j][i];
    }
  }
  return res;
};

const replicate = (
  // Create array of replicated value
  count, // new array length
  elem // value to replicate
  // Returns: replicated array
) => (Array.from({ length: count }, () => elem));

const zipWith = (
  // Zipping arrays using specific function
  fn, // function for zipping elements with index i
  ...arrays // input arrays
  // Element with index i of resulting array is result
  // of fn called with arguments from arrays
  // Returns: array
) => zip(...arrays).map(args => fn(...args));

const curryUntil = (
  // Curries function until the condition
  condition, // function(argsI, argsParts) returns boolean
  // argsI is arguments for i-th currying
  // argsParts is array of args given for currying from first to i-th currying
  fn, // function which will be curried
  ...args // arguments for fn
  // Returns: curried function
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
  ...args // arguments
  // Returns: curried function
) => {
  let argsTotalCount = 0;
  const condition = (argsI) => (
    argsTotalCount += argsI.length,
    argsTotalCount >= fn.length
  );
  return curryUntil(condition, fn, ...args);
};

const curryN = (
  // Curry fn count times
  // First curry uses args as arguments for first currying
  fn, // curried function
  count, // number of times function should be curried
  ...args // arguments for first currying
  // Returns: function curried given times count
) => {
  let i = -1;
  const condition = () => (i++, i === count);
  return curryUntil(condition, fn, ...args);
};

const curryTwice = (
  // Curry function curry with fn
  fn // function to be curried
  // Returns: function to pass arguments that returns curried fn
) => curry(curry, fn);

const applyArgs = (
  // Apply arguments
  ...args // arguments to save in closure
  // Returns: function to pass (fn) arguments will be applied
) => fn => fn(...args);

const either = (
  // Get first not errored result of fn
  fn // function to be called
  // Returns: result of `fn`
) => (
  ...args // arguments to iterate
) => {
  let arg, lastError;
  for (arg of args) {
    try {
      return fn(arg);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};

module.exports = {
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
  either
};
