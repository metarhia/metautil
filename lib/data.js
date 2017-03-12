'use strict';

module.exports = (api) => {

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
    return Array.isArray(obj) ? cloneArray(obj) : cloneObject(obj);
  };

  function cloneArray(arr) {
    const size = arr.length;
    const array = new Array(size);
    let i, val;
    for (i = 0; i < size; i++) {
      val = arr[i];
      if (typeof(val) !== 'object' || val === null) {
        array[i] = val;
      } else if (Array.isArray(val)) {
        array[i] = cloneArray(val);
      } else {
        array[i] = cloneObject(val);
      }
    }
    return array;
  }

  function cloneObject(obj) {
    const object = {};
    const keys = Object.keys(obj);
    const size = keys.length;
    let i, key, val;
    for (i = 0; i < size; i++) {
      key = keys[i];
      val = obj[key];
      if (typeof(val) !== 'object' || val === null) {
        object[key] = val;
      } else if (Array.isArray(val)) {
        object[key] = cloneArray(val);
      } else {
        object[key] = cloneObject(val);
      }
    }
    return object;
  }

  api.common.duplucate = (obj) => {
    if (typeof(obj) !== 'object' || obj === null) return obj;
    const references = new Map();
    return (
      Array.isArray(obj) ?
      duplicateArray(obj, references) :
      duplicateObject(obj, references)
    );
  };

  function duplicateArray(arr, references) {
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
        array[i] = duplicateArray(val, references);
      } else {
        array[i] = duplicateObject(val, references);
      }
    }
    return array;
  }

  function duplicateObject(obj, references) {
    const object = (
      obj.constructor ?
      new obj.constructor() :
      Object.create(null)
    );
    references.set(obj, object);
    const keys = Object.keys(obj);
    const size = keys.length;
    let i, key, val;
    for (i = 0; i < size; i++) {
      key = keys[i];
      val = obj[key];
      if (references.has(val)) {
        object[key] = references.get(val);
      } else if (typeof(val) !== 'object' || val === null) {
        object[key] = val;
      } else if (Array.isArray(val)) {
        object[key] = duplicateArray(val, references);
      } else {
        object[key] = duplicateObject(val, references);
      }
    }
    return object;
  }

  api.common.getByPath = (
    data, // data - object/hash
    dataPath // string in dot-separated path
  ) => {
    const path = dataPath.split('.');
    let obj = data;
    let i, len, next, prop;
    for (i = 0, len = path.length; i < len; i++) {
      prop = path[i];
      next = obj[prop];
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
    let i, len, next, prop;
    for (i = 0, len = path.length; i < len; i++) {
      prop = path[i];
      next = obj[prop];
      if (i === path.length - 1) {
        obj[prop] = value;
        return true;
      } else {
        if (next === undefined || next === null) {
          if (typeof(obj) !== 'object') return false;
          next = {};
          obj[prop] = next;
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
    let i, len, next, prop;
    for (i = 0, len = path.length; i < len; i++) {
      prop = path[i];
      next = obj[prop];
      if (i === path.length - 1) {
        if (obj.hasOwnProperty(prop)) {
          delete obj[prop];
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
