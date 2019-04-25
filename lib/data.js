'use strict';

const SCALAR_TYPES = ['boolean', 'number', 'string', 'undefined'];

// Check if value is scalar
//   value - <any>
// Returns: <boolean>
const isScalar = value => SCALAR_TYPES.includes(typeof value);

// Copy dataset (copy objects to new array)
//   ds - <Object[]>, source dataset to be copied
// Returns: <Object[]>
const copy = ds => ds.slice();

// Clone object or array
//   obj - <Object> | <Array>
// Returns: <Object> | <Array>
const clone = val => {
  if (typeof val !== 'object' || val === null) {
    return val;
  }
  const objOrArray = Array.isArray(val) ? new Array(val.length) : {};
  for (const key in val) {
    if (Object.prototype.hasOwnProperty.call(val, key)) {
      objOrArray[key] = clone(val[key]);
    }
  }
  return objOrArray;
};

const duplicateWithReferences = (val, references) => {
  if (typeof val !== 'object' || val === null) {
    return val;
  }
  let objOrArray;
  if (Array.isArray(val)) {
    objOrArray = new Array(val.length);
  } else if (Buffer.isBuffer(val)) {
    objOrArray = Buffer.from(val);
  } else if (!val.constructor) {
    objOrArray = Object.create(null);
  } else if (val.constructor.name !== 'Object') {
    objOrArray = new val.constructor(val.toString());
  } else {
    objOrArray = {};
  }
  references.set(val, objOrArray);
  for (const key in val) {
    if (!Object.prototype.hasOwnProperty.call(val, key)) {
      continue;
    }
    const reference = references.get(val[key]);
    if (reference !== undefined) {
      objOrArray[key] = reference;
    } else {
      objOrArray[key] = duplicateWithReferences(val[key], references);
    }
  }
  return objOrArray;
};

// Duplicate object or array (properly handles prototype and circular links)
//   obj - <Object> | <Array>
// Returns: <Object> | <Array>
const duplicate = val => duplicateWithReferences(val, new Map());

// Read property by dot-separated path
//   data - <Object>
//   dataPath - <string>, dot-separated path
// Returns: <any>, value
const getByPath = (data, dataPath) => {
  const path = dataPath.split('.');
  let obj = data;
  for (let i = 0; i < path.length; i++) {
    const prop = path[i];
    const next = obj[prop];
    if (next === undefined || next === null) return next;
    obj = next;
  }
  return obj;
};

// Set property by dot-separated path
//   data - <Object>
//   dataPath - <string>, dot-separated path
//   value - <any>, new value
const setByPath = (data, dataPath, value) => {
  const path = dataPath.split('.');
  const len = path.length;
  let obj = data;
  let i = 0;
  let next, prop;
  for (;;) {
    if (typeof obj !== 'object') return false;
    prop = path[i];
    if (i === len - 1) {
      obj[prop] = value;
      return true;
    }
    next = obj[prop];
    if (next === undefined || next === null) {
      next = {};
      obj[prop] = next;
    }
    obj = next;
    i++;
  }
};

// Delete property by dot-separated path
//   data - <Object>
//   dataPath - <string>, dot-separated path
// Returns: <boolean>
const deleteByPath = (data, dataPath) => {
  const path = dataPath.split('.');
  let obj = data;
  const len = path.length;
  for (let i = 0; i < len; i++) {
    const prop = path[i];
    const next = obj[prop];
    if (i === len - 1) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
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

// Distinctly merge multiple arrays
// Signature: ...args
//   args - <Array[]>, arrays with elements to be merged
// Returns: <Array>
const merge = (...args) => {
  const unique = new Set();
  const ilen = args.length;
  for (let i = 0; i < ilen; i++) {
    const arr = args[i];
    for (let j = 0; j < arr.length; j++) {
      unique.add(arr[j]);
    }
  }
  return [...unique];
};

// Merge multiple objects with merger
// Signature: merger, ...objs
//   merger - <Function>
//     key - <string> current merging key
//     ...values - <any[]> values under key
//   objs - <Object[]>, objects to be merged
// Returns: <Object>
const mergeObjects = (merger, ...objs) => {
  const keys = new Set();
  for (const obj of objs) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) keys.add(key);
    }
  }

  const result = {};
  for (const key of keys) {
    const args = new Array(objs.length);
    for (let i = 0; i < objs.length; ++i) {
      args[i] = objs[i][key];
    }
    result[key] = merger(key, ...args);
  }
  return result;
};

module.exports = {
  isScalar,
  copy,
  clone,
  duplicate,
  getByPath,
  setByPath,
  deleteByPath,
  merge,
  mergeObjects,
};
