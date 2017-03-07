'use strict';

module.exports = function(api) {

const SCALAR_TYPES = ['boolean', 'number', 'string'];

api.common.isScalar = variable => SCALAR_TYPES.includes(typeof(variable));

api.common.copy = (
  // Copy dataset (copy objects to new array)
  ds
) => ds.slice();
/* TODO: test speed in following implementations:
  1. slice() and slice(0)
  2. [].concat(arr);
  3. following solution:
  let result = [],
      l1 = ds.length;
  for (i = 0; i < l1; i++) {
    result.push(ds[i]);
  }
  return result;
*/

api.common.clone = (
  // Clone dataset (clone objects to new array)
  ds
) => cloneArray(ds);

function cloneObject(obj) {
  const result = {};
  const keys = Object.keys(obj);
  const len = keys.length;
  let i, key, val, type;
  for (i = 0; i < len; i++) {
    key = keys[i];
    val = obj[key];
    type = typeof(val);
    if (type === 'object') {
      result[key] = (
        Array.isArray(val) ? cloneArray(val) : cloneObject(val)
      );
    } else {
      result[key] = val;
    }
  }
  return result;
}

function cloneArray(arr) {
  const result = [];
  const len = arr.length;
  let i, val, type;
  for (i = 0; i < len; i++) {
    val = arr[i];
    type = typeof(val);
    if (type === 'object') {
      result.push(
        Array.isArray(val) ? cloneArray(val) : cloneObject(val)
      );
    } else {
      result.push(val);
    }
  }
  return result;
}

api.common.getByPath = (
  data, // data - object/hash
  dataPath // string in dot-separated path
) => {
  const path = dataPath.split('.');
  let obj = data;
  let i, len, next;
  for (i = 0, len = path.length; i < len; i++) {
    next = obj[path[i]];
    if (next === undefined || next === null) return next;
    obj = next;
  }
  return obj;
};

api.common.setByPath = (
  data, // object/hash
  dataPath, // string in dot-separated path
  value // value to be assigned
) => {
  const path = dataPath.split('.');
  let obj = data;
  let i, len, next;
  for (i = 0, len = path.length; i < len; i++) {
    next = obj[path[i]];
    if (i === path.length - 1) {
      obj[path[i]] = value;
      return true;
    } else {
      if (next === undefined || next === null) {
        if (typeof(obj) !== 'object') return false;
        next = {};
        obj[path[i]] = next;
      }
      obj = next;
    }
  }
  return false;
};

api.common.deleteByPath = (
  data, // object/hash
  dataPath // string in dot-separated path
) => {
  const path = dataPath.split('.');
  let obj = data;
  let i, len, next;
  for (i = 0, len = path.length; i < len; i++) {
    next = obj[path[i]];
    if (i === path.length - 1) {
      if (obj.hasOwnProperty(path[i])) {
        delete obj[path[i]];
        return true;
      }
    } else {
      if (next === undefined || next === null) return false;
      obj = next;
    }
  }
  return false;
};

api.common.merge = (...args) => {
  const array = args[0];
  let i, ilen, j, jlen, arr, val;
  for (i = 1, ilen = args.length; i < ilen; i++) {
    arr = args[i];
    for (j = 0, jlen = arr.length; j < jlen; j++) {
      val = arr[j];
      if (!array.includes(val)) array.push(val);
    }
  }
  return array;
};

};
