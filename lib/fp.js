'use strict';

const { safeCallback } = require('./callbacks');

// Partially apply arguments to function
// Signature: fn, ...args
//   fn - <Function>
//   args - <Array>, arguments to be applied
// Returns: <Function>, function(...rest)
//   rest - <Array>, arguments
const partial = (fn, ...args) => (...rest) => fn(...args.concat(rest));

// Map object fields with provided function
//   mapFn - <Function>, to apply to every field value
//   obj - <Object>, which fields used for mapping
// Returns: <Object>, with same reference but with transformed fields
const omap = (mapFn, obj) => {
  for (const key in obj) {
    obj[key] = mapFn(obj[key]);
  }
  return obj;
};

// Compose multiple functions into one
// Signature: ...fns
//   fns - <Array>, functions to be composed
// Returns: <Function>, function(...args), composed
//   args - <Array>, arguments to be passed to the first function
const compose = (...fns) => (...args) => {
  if (fns.length === 0) return args[0];

  let res = fns[0](...args);
  for (let i = 1; i < fns.length; i++) {
    res = fns[i](res);
  }
  return res;
};

// Apply given function to value or default value
// Signature: fn, defVal[, value]
//   fn - <Function>
//   defVal - <any>, default value
//   value - <any>, (optional), value
// Returns: <any>, result of `fn` or `defVal`
const maybe = (fn, defVal, value) =>
  value !== undefined && value !== null ? fn(value) : defVal;

// Zip several arrays into one
// Signature: ...arrays
//   arrays - <Array[]>, arrays to be zipped
// Returns: <Array>, length is minimal of input arrays length,
//          element with index i of resulting array is array with
//          elements with index i from input array
const zip = (...arrays) => {
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

// Create array of replicated values
//   count - <number>, new array length
//   elem - <any>, value to replicate
// Returns: <Array>, replicated
const replicate = (count, elem) => Array.from({ length: count }, () => elem);

// Zip arrays using specific function
// Signature: fn, ...arrays
//   fn - <Function>, for zipping elements with index i
//   arrays - <Array[]>, arrays to be zipped
// Returns: <Array>, zipped, element with index i of resulting array is result
//          of fn called with arguments from arrays
const zipWith = (fn, ...arrays) => zip(...arrays).map(args => fn(...args));

// Curry function until the condition is met
// Signature: condition, fn, ...args
//   condition - <Function>, returns: <boolean>
//     argsI - <Array>, arguments for i-th currying
//     argsParts - <Array>, of args given for currying
//         from first to i-th currying
//   fn - <Function>, to be curried
//   args - <Array>, arguments for fn
// Returns: <Function>, function(...args), curried
//   args - <Array>, arguments
const curryUntil = (condition, fn, ...args) => {
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

// Curry function with given arguments
// Signature: fn, ...param
//   fn - <Function>, to be curried
//   param - <Array>, arguments to the function
// Returns: <Function>, function(...args), curried
const curry = (fn, ...param) => {
  const curried = (...args) =>
    fn.length > args.length ? curry(fn.bind(null, ...args)) : fn(...args);
  return param.length ? curried(...param) : curried;
};

// Curry fn count times, first curry uses args for first currying
// Signature: fn, count, ...args
//   fn - <Function>, to be curried
//   count - <number>, of times function should be curried
//   args - <Array>, arguments for first currying
// Returns: <Function>, curried given times count
const curryN = (fn, count, ...args) => {
  let i = -1;
  const condition = () => (i++, i === count);
  return curryUntil(condition, fn, ...args);
};

// Curry function curry with fn
//   fn - <Function>, to be curried
// Returns: <Function>, to pass arguments that returns curried fn
const curryTwice = fn => curry(curry, fn);

// Apply arguments
// Signature: ...args
//   args - <Array>, arguments to save in closure
// Returns: <Function>, returns: <any>, result of `fn(...args)`
//   fn - <Function>, to be applied saved arguments
const applyArgs = (...args) => fn => fn(...args);

// Get first not errored result of fn
//   fn - <Function>, to be called
// Returns: <Function>, function(...args), returns: <any>, result of `fn(arg)`,
//     where `arg` - first valid element of `args`
//   args - <Array>, arguments to iterate
// Throws: <Error>, if `fn` throws it
const either = fn => (...args) => {
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

// Rest left, transform function
//   fn - <Function>, function(args, ...namedArgs, callback)
//     args - <Array>, rest of spreadArgs created by excluding namedArgs
//     namedArgs - <Array>, first values of spreadArgs,
//         length is based upon interface of fn
//     callback - <Function>, callback, last argument of spreadArgs
// Returns: <Function>, function(...spreadArgs)
//   spreadArgs - <Array>, arguments to be added
const restLeft = fn => (...spreadArgs) => {
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
