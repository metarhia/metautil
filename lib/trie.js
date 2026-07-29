'use strict';

const VALUE = Symbol('value');

class Trie {
  #root = Object.create(null);
  #size = 0;

  get size() {
    return this.#size;
  }

  insert(word, ...args) {
    if (typeof word !== 'string') {
      throw new TypeError('Word must be a string');
    }
    const value = args.length === 0 ? true : args[0];
    let node = this.#root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      let child = node[char];
      if (!child) {
        child = Object.create(null);
        node[char] = child;
      }
      node = child;
    }
    if (!Object.hasOwn(node, VALUE)) this.#size++;
    node[VALUE] = value;
    return this;
  }

  delete(word) {
    if (typeof word !== 'string') return false;
    const path = [];
    let node = this.#root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const child = node[char];
      if (!child) return false;
      path.push(node, char);
      node = child;
    }
    if (!Object.hasOwn(node, VALUE)) return false;
    Reflect.deleteProperty(node, VALUE);
    this.#size--;
    for (let i = path.length - 2; i >= 0; i -= 2) {
      const parent = path[i];
      const char = path[i + 1];
      const child = parent[char];
      if (Object.hasOwn(child, VALUE)) break;
      if (Object.keys(child).length > 0) break;
      Reflect.deleteProperty(parent, char);
    }
    return true;
  }

  clear() {
    this.#root = Object.create(null);
    this.#size = 0;
  }

  isEmpty() {
    return this.#size === 0;
  }

  has(word) {
    const node = this.#find(word);
    return node !== null && Object.hasOwn(node, VALUE);
  }

  get(word) {
    const node = this.#find(word);
    let value;
    if (node !== null && Object.hasOwn(node, VALUE)) value = node[VALUE];
    return value;
  }

  complete(prefix) {
    const node = this.#find(prefix);
    if (!node) return [];
    return this.#collect(node, prefix);
  }

  #find(word) {
    if (typeof word !== 'string') return null;
    let node = this.#root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      node = node[char];
      if (!node) return null;
    }
    return node;
  }

  #collect(node, path, words = []) {
    if (Object.hasOwn(node, VALUE)) words.push(path);
    const keys = Object.keys(node);
    for (let i = 0; i < keys.length; i++) {
      const char = keys[i];
      this.#collect(node[char], path + char, words);
    }
    return words;
  }
}

module.exports = { Trie };
