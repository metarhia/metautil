'use strict';

module.exports = (api) => {

  api.common.curry = (fn, ...args) => fn.bind(null, ...args);

  api.common.compose = (...fns) => (...args) => {
    if (fns.length === 0) return args[0];

    let res = fns[0](...args);
    let i;
    for (i = 1; i < fns.length; i++) {
      res = fns[i](res);
    }
    return res;
  };

};
