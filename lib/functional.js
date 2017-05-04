'use strict';

module.exports = (api) => {

  api.common.curry = (fn, ...args) => fn.bind(null, ...args);

};
