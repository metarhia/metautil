'use strict';

module.exports = (api) => {

  api.common.curry = (fn, ...args) => fn.bind(null, ...args);

  api.common.omap = (
    // Function for mapping object fields
    mapFn, // funtions applied to every field value
    obj // object which fields used for mapping
    // Returns object with same reference but with transformed fields
  ) => {
    let key;
    for (key in obj) {
      obj[key] = mapFn(obj[key]);
    }
    return obj;
  };

  api.common.compose = (...fns) => (...args) => {
    if (fns.length === 0) return args[0];

    let res = fns[0](...args);
    let i;
    for (i = 1; i < fns.length; i++) {
      res = fns[i](res);
    }
    return res;
  };

  api.common.maybe = (fn, defVal, value) => (
    value !== undefined && value !== null ? fn(value) : defVal
  );

  api.common.zip = (
    // Zipping several arrays into one.
    ...arrays // input arrays
    // Returns array length is minimal of input arrays length
    // Element with index i of resulting array is array with
    // elements with index i from input arrays.
  ) => {
    if (arrays.length === 0) return [];
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

  api.common.replicate = (count, elem) => {
    const res = new Array(count);
    let i;
    for (i = 0; i < count; i++) {
      res[i] = elem;
    }
    return res;
  };

  api.common.zipWith = (
    // Zipping arrays using specific function
    fn, // function for zipping elements with index i
    ...arrays // input arrays
    // Element with index i of resulting array is result
    // of fn called with arguments from arrays
  ) => (
    api.common
      .zip(...arrays)
      .map(args => fn(...args))
  );

  api.common.curryUntil = (
    // Curries function until the condition
    condition, // function(argsI, argsParts) returns boolean
    // argsI is arguments for i-th currying
    // argsParts is array of args given for currying from first to i-th currying
    fn, // function which will be curried
    ...args1 // arguments for fn
    // Returns curried function
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

    return curryMore(...args1);
  };

  api.common.curryN = (
    // Curry fn count times.
    // First curry uses args as arguments for first currying
    fn, // curried function
    count, // number of times function should be curried
    ...args1 // arguments for first currying
    // Returns curried count times function
  ) => {
    let i = -1;
    const condition = () => (i++, i === count);
    return api.common.curryUntil(condition, fn, ...args1);
  };

  api.common.curryTwice = fn => api.common.curry(api.common.curry, fn);


  api.common.fullCurry = (fn, ...args1) => {
    let argsTotalCount = 0;
    const condition = (argsI) => (
      argsTotalCount += argsI.length,
      argsTotalCount >= fn.length
    );
    return api.common.curryUntil(condition, fn, ...args1);
  };

  api.common.applyArgs = (...args) => fn => fn(...args);

  api.common.either = (fn) => (...args) => {
    let arg;
    let lastError;
    for (arg of args) {
      try {
        return fn(arg);
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError;
  };

};
