'use strict';

const strings = require('./strings.js');

const makePrivate = (instance) => {
  const iface = {};
  const fields = Object.keys(instance);
  for (const fieldName of fields) {
    const field = instance[fieldName];
    if (strings.isConstant(fieldName)) {
      iface[fieldName] = field;
    } else if (typeof field === 'function') {
      const bindedMethod = field.bind(instance);
      iface[fieldName] = bindedMethod;
      instance[fieldName] = bindedMethod;
    }
  }
  return iface;
};

const protect = (allowMixins, ...namespaces) => {
  for (const namespace of namespaces) {
    const names = Object.keys(namespace);
    for (const name of names) {
      const target = namespace[name];
      if (!allowMixins.includes(name)) Object.freeze(target);
    }
  }
};

const jsonParse = (buffer) => {
  if (buffer.length === 0) return null;
  try {
    return JSON.parse(buffer);
  } catch {
    return null;
  }
};

const isHashObject = (o) =>
  typeof o === 'object' && o !== null && !Array.isArray(o);

const flatObject = (sourceObject, fieldNames = []) => {
  const target = {};
  for (const [key, value] of Object.entries(sourceObject)) {
    if (!isHashObject(value)) {
      target[key] = value;
      continue;
    }
    if (fieldNames.length > 0 && !fieldNames.includes(key)) {
      target[key] = { ...value };
      continue;
    }
    for (const [childKey, childValue] of Object.entries(value)) {
      const combined = `${key}${strings.toUpperCamel(childKey)}`;
      if (sourceObject[combined] !== undefined) {
        const error = `Can not combine keys: key "${combined}" already exists`;
        throw new Error(error);
      }
      target[combined] = childValue;
    }
  }
  return target;
};

const unflatObject = (sourceObject, fieldNames) => {
  const result = {};
  for (const [key, value] of Object.entries(sourceObject)) {
    const prefix = fieldNames.find((name) => key.startsWith(name));
    if (prefix) {
      if (Object.prototype.hasOwnProperty.call(sourceObject, prefix)) {
        throw new Error(`Can not combine keys: key "${prefix}" already exists`);
      }
      const newKey = key.substring(prefix.length).toLowerCase();
      const section = result[prefix];
      if (section) section[newKey] = value;
      else result[prefix] = { [newKey]: value };
      continue;
    }
    result[key] = value;
  }
  return result;
};

const getSignature = (method) => {
  const src = method.toString();
  const signature = strings.between(src, '({', '})');
  if (signature === '') return [];
  return signature.split(',').map((s) => s.trim());
};

const namespaceByPath = (namespace, path) => {
  const [key, rest] = strings.split(path, '.');
  const step = namespace[key];
  if (!step) return null;
  if (rest === '') return step;
  return namespaceByPath(step, rest);
};

module.exports = {
  makePrivate,
  protect,
  jsonParse,
  isHashObject,
  flatObject,
  unflatObject,
  getSignature,
  namespaceByPath,
};
