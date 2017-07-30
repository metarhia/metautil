'use strict';

const tap = require('tap');
const common = require('..');

class Parent {
  constructor() {
    this.property0 = 'from Parent.constructor';
  }

  method1() {
    this.property1 = 'from Parent.method1';
  }
}

class Lazy {
  constructor() {
    this.property2 = 'from Lazy.constructor';
  }

  method2() {
    this.property3 = 'from Lazy.method2';
  }
}

class Child extends Parent {
  constructor() {
    super();
    this.property4 = 'from Child.constructor';
  }

  method3() {
    this.property5 = 'from Child.method3';
  }
}

common.mixin(Child.prototype, Lazy.prototype);

tap.test('multiple inheritance with mixin', (test) => {
  const obj = new Child();
  obj.method1();
  obj.method2();
  obj.method3();
  test.strictSame(obj.property0, 'from Parent.constructor');
  test.strictSame(obj.property4, 'from Child.constructor');
  test.strictSame(obj.property1, 'from Parent.method1');
  test.strictSame(obj.property3, 'from Lazy.method2');
  test.strictSame(obj.property5, 'from Child.method3');
  test.end();
});
