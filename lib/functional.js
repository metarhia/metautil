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

    let minLen = arrays[0].length;
    let i;
    for (i = 1; i < arrays.length; i++) {
      minLen = Math.min(arrays[i].length, minLen);
    }

    const res = new Array(minLen);
    for (i = 0; i < res.length; i++) {
      res[i] = new Array(arrays.length);
      let j;
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

  api.common.curryTwice = fn => api.common.curry(api.common.curry, fn);

  api.common.fullCurry = (fn, ...args1) => {
    let argsTotalCount = 0;
    const argsParts = [];

    const curryMore = (...argsI) => {
      argsTotalCount += argsI.length;
      argsParts.push(argsI);
      if (argsTotalCount < fn.length) {
        return curryMore;
      } else {
        const allArgs = [].concat(...argsParts);
        return fn(...allArgs);
      }
    };

    return curryMore(...args1);
  };

  api.common.applyArgs = (...args) => fn => fn(...args);

};
