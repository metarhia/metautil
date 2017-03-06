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

api.common.clone = (obj) => {
  if (typeof(obj) !== 'object' || obj === null) return obj;
  return Array.isArray(obj) ? cloneArr(obj) : cloneObj(obj);
};

function cloneArr(arr) {
  const size = arr.length;
  const array = new Array(size);
  let i, val;
  for (i = 0; i < size; i++) {
    val = arr[i];
    if (typeof(val) !== 'object' || val === null) {
      array[i] = val;
    } else if (Array.isArray(val)) {
      array[i] = cloneArr(val);
    } else {
      array[i] = cloneObj(val);
    }
  }
  return array;
}

function cloneObj(obj) {
  const clone = {};
  const keys = Object.keys(obj);
  const size = keys.length;
  let i, val;
  for (i = 0; i < size; i++) {
    val = obj[keys[i]];
    if (typeof(val) !== 'object' || val === null) {
      clone[keys[i]] = val;
    } else if (Array.isArray(val)) {
      clone[keys[i]] = cloneArr(val);
    } else {
      clone[keys[i]] = cloneObj(val);
    }
  }
  return clone;
}

api.common.duplucate = (obj) => {
  if (typeof(obj) !== 'object' || obj === null) return obj;
  const refs = new Map();
  return Array.isArray(obj) ? duplicateArr(obj, refs) : duplicateObj(obj, refs);
};

function duplicateArr(arr, references) {
  const size = arr.length;
  const array = new Array(size);
  references.set(arr, array);
  let i, val;
  for (i = 0; i < size; i++) {
    val = arr[i];
    if (references.has(val)) {
      array[i] = references.get(val);
    } else  if (typeof(val) !== 'object' || val === null) {
      array[i] = val;
    } else if (Array.isArray(val)) {
      array[i] = duplicateArr(val, references);
    } else {
      array[i] = duplicateObj(val, references);
    }
  }
  return array;
}

function duplicateObj(obj, references) {
  const clone = obj.constructor ? new obj.constructor() : Object.create(null);
  references.set(obj, clone);
  const keys = Object.keys(obj);
  const size = keys.length;
  let i, val;
  for (i = 0; i < size; i++) {
    val = obj[keys[i]];
    if (references.has(val)) {
      clone[keys[i]] = references.get(val);
    } else if (typeof(val) !== 'object' || val === null) {
      clone[keys[i]] = val;
    } else if (Array.isArray(val)) {
      clone[keys[i]] = duplicateArr(val, references);
    } else {
      clone[keys[i]] = duplicateObj(val, references);
    }
  }
  return clone;
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
