'use strict';

const common = {};
module.exports = common;

common.copy = (
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

common.clone = (
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
