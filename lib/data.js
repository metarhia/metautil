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

let cloneArray = null;
let cloneObject = null;

// Clone object or array
//   obj - <Object> | <Array>
// Returns: <Object> | <Array>
const clone = obj => {
  if (typeof obj !== 'object' || obj === null) return obj;
  return Array.isArray(obj) ? cloneArray(obj) : cloneObject(obj);
};

cloneArray = arr => {
  const size = arr.length;
  const array = new Array(size);
  for (let i = 0; i < size; i++) {
    const val = arr[i];
    if (typeof val !== 'object' || val === null) {
      array[i] = val;
    } else if (Array.isArray(val)) {
      array[i] = cloneArray(val);
    } else {
      array[i] = cloneObject(val);
    }
  }
  return array;
};

cloneObject = obj => {
  const object = {};
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const val = obj[key];
    if (typeof val !== 'object' || val === null) {
      object[key] = val;
    } else if (Array.isArray(val)) {
      object[key] = cloneArray(val);
    } else {
      object[key] = cloneObject(val);
    }
  }
  return object;
};

let duplicateArray = null;
let duplicateObject = null;

// Duplicate object or array (properly handles prototype and circular links)
//   obj - <Object> | <Array>
// Returns: <Object> | <Array>
const duplicate = obj => {
  if (typeof obj !== 'object' || obj === null) return obj;
  const references = new Map();
  const dup = Array.isArray(obj) ? duplicateArray : duplicateObject;
  return dup(obj, references);
};

duplicateArray = (arr, references) => {
  const size = arr.length;
  const array = new Array(size);
  references.set(arr, array);
  for (let i = 0; i < size; i++) {
    const val = arr[i];
    if (references.has(val)) {
      array[i] = references.get(val);
    } else  if (typeof val !== 'object' || val === null) {
      array[i] = val;
    } else if (Array.isArray(val)) {
      array[i] = duplicateArray(val, references);
    } else {
      array[i] = duplicateObject(val, references);
    }
  }
  return array;
};

duplicateObject = (obj, references) => {
  let object;
  if (!obj.constructor) {
    object = Object.create(null);
  } else if (obj.constructor.name !== 'Object') {
    object = new obj.constructor(obj.toString());
  } else {
    object = {};
  }
  references.set(obj, object);
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const val = obj[key];
    if (references.has(val)) {
      object[key] = references.get(val);
    } else if (typeof val !== 'object' || val === null) {
      object[key] = val;
    } else if (Array.isArray(val)) {
      object[key] = duplicateArray(val, references);
    } else {
      object[key] = duplicateObject(val, references);
    }
  }
  return object;
};

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
  let i = 0, next, prop;
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

// Distinctly merge multiple arrays
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
//   merger - <Function>
//   objs - <Object[]>, objects to be merged
// Returns: <Object>
const mergeObjects = (merger, ...objs) => {
  const keys = new Set();
  for (const obj of objs) {
    for (const key in obj) {
      keys.add(key);
    }
  }

  const result = {};
  for (const key of keys) {
    const args = new Array(objs.length);
    for (let i = 0; i < objs.length; ++i) {
      args[i] = objs[i][key];
    }
    result[key] = merger(...args);
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
