'use strict';

const metatests = require('metatests');
const { Iterator, iter, iterEntries, iterKeys, iterValues } = require('..');

const array = [1, 2, 3, 4];

metatests.test('new Iterator() on non Iterable', test => {
  test.throws(() => {
    new Iterator(2);
  }, new TypeError('Base is not Iterable'));
  test.end();
});

metatests.test('iter returns an Iterator', test => {
  const iterator = iter(array);
  test.assert(iterator instanceof Iterator);
  test.end();
});

metatests.test('Iterator is Iterable', test => {
  const iterator = iter(array);
  let sum = 0;
  for (const value of iterator) {
    sum += value;
  }

  test.strictSame(sum, 10);
  test.end();
});

metatests.testSync('Iterator has Symbol.toStringTag property', test => {
  const tag = 'Metarhia Iterator';
  test.strictSame(Iterator.prototype[Symbol.toStringTag], tag);
  const iterator = iter(array);
  test.strictSame(iterator[Symbol.toStringTag], tag);
  test.strictSame(Object.prototype.toString.call(iterator), `[object ${tag}]`);
});

metatests.test('Iterator.count', test => {
  test.strictSame(iter(array).count(), array.length);
  test.end();
});

metatests.test('Iterator.count on consumed iterator', test => {
  test.strictSame(
    iter(array)
      .skip(array.length)
      .count(),
    0
  );
  test.end();
});

metatests.test('Iterator.each', test => {
  const iterator = iter(array);
  let sum = 0;
  iterator.each(value => {
    sum += value;
  });

  test.strictSame(sum, 10);
  test.end();
});

metatests.test('Iterator.forEach', test => {
  const iterator = iter(array);
  let sum = 0;
  iterator.forEach(value => {
    sum += value;
  });

  test.strictSame(sum, 10);
  test.end();
});

metatests.test('Iterator.forEach with thisArg ', test => {
  const iterator = iter(array);
  const obj = {
    sum: 0,
    fn(value) {
      this.sum += value;
    },
  };

  iterator.forEach(obj.fn, obj);

  test.strictSame(obj.sum, 10);
  test.end();
});

metatests.test('Iterator.reduce', test => {
  test.strictSame(
    iter(array).reduce((acc, current) => acc + current, 0),
    10
  );
  test.end();
});

metatests.test('Iterator.reduce with no initialValue', test => {
  test.strictSame(
    iter(array).reduce((acc, current) => acc + current),
    10
  );
  test.end();
});

metatests.test(
  'Iterator.reduce with no initialValue on consumed iterator',
  test => {
    const iterator = iter(array);
    test.throws(() => {
      iterator.reduce(() => {});
      iterator.reduce((acc, current) => acc + current);
    }, new TypeError('Reduce of consumed iterator with no initial value'));

    test.end();
  }
);

metatests.test('Iterator.map', test => {
  test.strictSame(
    iter(array)
      .map(value => value * 2)
      .toArray(),
    [2, 4, 6, 8]
  );
  test.end();
});

metatests.test('Iterator.map with thisArg', test => {
  const obj = {
    multiplier: 2,
    mapper(value) {
      return value * this.multiplier;
    },
  };

  test.strictSame(
    iter(array)
      .map(obj.mapper, obj)
      .toArray(),
    [2, 4, 6, 8]
  );
  test.end();
});

metatests.test('Iterator.filter', test => {
  test.strictSame(
    iter(array)
      .filter(value => !(value % 2))
      .toArray(),
    [2, 4]
  );
  test.end();
});

metatests.test('Iterator.filter with thisArg', test => {
  const obj = {
    divider: 2,
    predicate(value) {
      return !(value % this.divider);
    },
  };

  test.strictSame(
    iter(array)
      .filter(obj.predicate, obj)
      .toArray(),
    [2, 4]
  );
  test.end();
});

metatests.test('Iterator.filterMap', test => {
  test.strictSame(
    iter(array)
      .filterMap(value => (value > 2 ? value * 2 : undefined))
      .toArray(),
    [6, 8]
  );
  test.end();
});

metatests.test('Iterator.filterMap with thisArg', test => {
  const obj = {
    divider: 2,
    predicate(value) {
      return value % this.divider === 0 ? value * 2 : undefined;
    },
  };

  test.strictSame(
    iter(array)
      .filterMap(obj.predicate, obj)
      .toArray(),
    [4, 8]
  );
  test.end();
});

metatests.test('Iterator.filterMap with filterValue', test => {
  test.strictSame(
    iter(array)
      .filterMap(value => (value > 2 ? value * 2 : 42), null, 42)
      .toArray(),
    [6, 8]
  );
  test.end();
});

metatests.test('Iterator.flat', test => {
  const array = [[[[1], 2], 3], 4];
  const flatArray = [1, 2, 3, 4];
  test.strictSame(
    iter(array)
      .flat(3)
      .toArray(),
    flatArray
  );
  test.end();
});

metatests.test('Iterator.flat with no depth', test => {
  const array = [[[[1], 2], 3], 4];
  const flatArray = [[[1], 2], 3, 4];
  test.strictSame(
    iter(array)
      .flat()
      .toArray(),
    flatArray
  );
  test.end();
});

metatests.test('Iterator.flatMap', test => {
  const array = [1, 2, 3];
  const result = [1, 1, 2, 2, 3, 3];
  test.strictSame(
    iter(array)
      .flatMap(element => [element, element])
      .toArray(),
    result
  );
  test.end();
});

metatests.test(
  'Iterator.flatMap that returns neither Iterator nor Iterable',
  test => {
    const array = [1, 2, 3];
    const result = [2, 4, 6];
    test.strictSame(
      iter(array)
        .flatMap(element => element * 2)
        .toArray(),
      result
    );
    test.end();
  }
);

metatests.test('Iterator.flatMap with thisArg', test => {
  const obj = {
    value: 1,
    mapper(element) {
      return [element, this.value];
    },
  };

  const array = [1, 2, 3];
  const result = [1, 1, 2, 1, 3, 1];
  test.strictSame(
    iter(array)
      .flatMap(obj.mapper, obj)
      .toArray(),
    result
  );
  test.end();
});

metatests.test('Iterator#zip with single iterator', test => {
  const it = iter(array).take(1);
  const toZip = iter(array).skip(2);
  test.strictSame(it.zip(toZip).toArray(), [[1, 3]]);
  test.end();
});

metatests.test('Iterator#zip with multiple iterators', test => {
  const it = iter(array);
  const itr = iter(array).take(3);
  const iterator = iter(array).take(2);
  test.strictSame(it.zip(itr, iterator).toArray(), [
    [1, 1, 1],
    [2, 2, 2],
  ]);
  test.end();
});

metatests.test('Iterator.zip with single iterator', test => {
  const it1 = iter(array).take(1);
  const it2 = iter(array).skip(2);
  test.strictSame(Iterator.zip(it1, it2).toArray(), [[1, 3]]);
  test.end();
});

metatests.test('Iterator.zip with multiple iterators', test => {
  const it1 = iter(array);
  const it2 = iter(array).take(3);
  const it3 = iter(array).take(2);
  test.strictSame(Iterator.zip(it1, it2, it3).toArray(), [
    [1, 1, 1],
    [2, 2, 2],
  ]);
  test.end();
});

metatests.test('Iterator.chain', test => {
  const it = iter(array).take(1);
  const itr = iter(array)
    .skip(1)
    .take(1);
  const iterator = iter(array)
    .skip(2)
    .take(2);
  test.strictSame(it.chain(itr, iterator).toArray(), [1, 2, 3, 4]);
  test.end();
});

metatests.test('Iterator.take', test => {
  const it = iter(array).take(2);
  test.strictSame(it.next().value, 1);
  test.strictSame(it.next().value, 2);
  test.assert(it.next().done);
  test.end();
});

metatests.testSync('Iterator.takeWhile', test => {
  const it = iter(array).takeWhile(x => x < 3);
  test.strictSame(it.toArray(), [1, 2]);
  test.assert(it.next().done);
});

metatests.test('Iterator.skip', test => {
  const it = iter(array).skip(2);
  test.strictSame(it.next().value, 3);
  test.strictSame(it.next().value, 4);
  test.assert(it.next().done);
  test.end();
});

metatests.test('Iterator.skipWhile', test => {
  const it = iter(array).skipWhile(v => v < 3);
  test.strictSame(it.next().value, 3);
  test.strictSame(it.next().value, 4);
  test.assert(it.next().done);
  test.end();
});

metatests.test(
  'Iterator.skipWhile must stop skipping after first predicate failure',
  test => {
    const it = iter([1, 2, 3, 2, 1]).skipWhile(v => v < 3);
    test.strictSame(it.next().value, 3);
    test.strictSame(it.next().value, 2);
    test.strictSame(it.next().value, 1);
    test.assert(it.next().done);
    test.end();
  }
);

metatests.test('Iterator.skipWhile with thisArg', test => {
  const obj = {
    start: 3,
    predicate(value) {
      return value < this.start;
    },
  };

  const it = iter(array).skipWhile(obj.predicate, obj);
  test.strictSame(it.next().value, 3);
  test.strictSame(it.next().value, 4);
  test.assert(it.next().done);
  test.end();
});

metatests.testSync('Iterator.partition empty', test => {
  const p = iter([]).partition();
  test.strictSame(p, [[], []]);
});

metatests.testSync('Iterator.partition boolean fn', test => {
  const p = iter([1, 2, 3, 4, 5]).partition(v => v % 2 === 0);
  test.strictSame(p, [
    [1, 3, 5],
    [2, 4],
  ]);
});

metatests.testSync('Iterator.partition number fn', test => {
  const p = iter([1, 2, 3, 4, 5]).partition(v => v % 2);
  test.strictSame(p, [
    [2, 4],
    [1, 3, 5],
  ]);
});

metatests.testSync('Iterator.partition number fn multiple', test => {
  const p = iter([1, 2, 3, 4, 5]).partition(v => v % 3);
  test.strictSame(p, [[3], [1, 4], [2, 5]]);
});

metatests.testSync('Iterator.partition boolean fn thisArg', test => {
  const p = iter([1, 2, 3, 4, 5]).partition(
    function(v) {
      return v % 2 === this.res;
    },
    { res: 1 }
  );
  test.strictSame(p, [
    [2, 4],
    [1, 3, 5],
  ]);
});

metatests.testSync('Iterator.partition number fn thisArg', test => {
  const p = iter([1, 2, 3, 4, 5]).partition(
    function(v) {
      return v % 2 === 0 ? this.part : 0;
    },
    { part: 4 }
  );
  test.strictSame(p, [[1, 3, 5], [], [], [], [2, 4]]);
});

metatests.test('Iterator.every that must return true', test => {
  test.assert(iter(array).every(element => element > 0));
  test.end();
});

metatests.test('Iterator.every that must return false', test => {
  test.assertNot(iter(array).every(element => element % 2));
  test.end();
});

metatests.test('Iterator.every with thisArg', test => {
  const obj = {
    min: 0,
    predicate(value) {
      return value > this.min;
    },
  };

  test.assert(iter(array).every(obj.predicate, obj));
  test.end();
});

metatests.test('Iterator.some that must return true', test => {
  test.assert(iter(array).some(element => element % 2));
  test.end();
});

metatests.test('Iterator.some that must return false', test => {
  test.assertNot(iter(array).some(element => element < 0));
  test.end();
});

metatests.test('Iterator.some with thisArg', test => {
  const obj = {
    max: 2,
    predicate(value) {
      return value < this.max;
    },
  };

  test.assert(iter(array).some(obj.predicate, obj));
  test.end();
});

metatests.testSync('Iterator.someCount that must return true', test => {
  test.assert(iter(array).someCount(element => element % 2, 2));
});

metatests.testSync('Iterator.someCount that must return false', test => {
  test.assertNot(iter(array).someCount(element => element % 2, 3));
  test.assertNot(iter(array).someCount(element => element < 0, 1));
});

metatests.testSync('Iterator.someCount with thisArg', test => {
  const obj = {
    max: 3,
    predicate(value) {
      return value < this.max;
    },
  };

  test.assert(iter(array).someCount(obj.predicate, 2, obj));
});

metatests.test('Iterator.find that must find an element', test => {
  test.strictSame(
    iter(array).find(element => element % 2 === 0),
    2
  );
  test.end();
});

metatests.test('Iterator.find that must not find an element', test => {
  test.strictSame(
    iter(array).find(element => element > 4),
    undefined
  );
  test.end();
});

metatests.test('Iterator.find with thisArg', test => {
  const obj = {
    divider: 2,
    predicate(value) {
      return value % this.divider === 0;
    },
  };

  test.strictSame(iter(array).find(obj.predicate, obj), 2);
  test.end();
});

metatests.test('Iterator.includes that must return true', test => {
  test.assert(iter(array).includes(1));
  test.end();
});

metatests.test('Iterator.includes with a NaN', test => {
  test.assert(iter([1, 2, NaN]).includes(NaN));
  test.end();
});

metatests.test('Iterator.includes that must return false', test => {
  test.assertNot(iter(array).includes(0));
  test.end();
});

metatests.test('Iterator.includes with strings', test => {
  const strings = ['a', 'b', 'c'];
  test.assert(iter(strings).includes('a'));
  test.assertNot(iter(strings).includes('d'));
  test.end();
});

metatests.test('Iterator.includes with non-number values', test => {
  const obj = {};
  const values = [undefined, null, obj, Symbol('symbol')];
  test.assert(iter(values).includes(obj));
  test.assertNot(iter(values).includes({}));
  test.assert(iter(values).includes(undefined));
  test.assert(iter(values).includes(null));
  test.assertNot(iter(values).includes(Symbol('symbol')));
  test.end();
});

metatests.test('Iterator.collectTo must collect to given Collection', test => {
  const set = iter(array).collectTo(Set);
  test.strictSame([...set.values()], array);
  test.end();
});

metatests.test('Iterator.toArray must convert to array', test => {
  test.strictSame(iter(array).toArray(), array);
  test.end();
});

metatests.test(
  'Iterator.collectWith must collect to a provided object',
  test => {
    const set = new Set();
    iter(array).collectWith(set, (obj, element) => obj.add(element));
    test.strictSame([...set.values()], array);
    test.end();
  }
);

metatests.test('Iterator.collectWith must return provided object', test => {
  const set = iter(array).collectWith(new Set(), (obj, element) => {
    obj.add(element);
  });
  test.strictSame([...set.values()], array);
  test.end();
});

metatests.testSync('Iterator.enumerate must return tuples', test => {
  let i = 0;
  iter(array)
    .enumerate()
    .forEach(t => {
      test.strictSame(t, [i, array[i]]);
      i++;
    });
});

metatests.testSync('Iterator.enumerate must start from 0', test => {
  const it = iter(array);
  it.next();
  let i = 0;
  it.enumerate().forEach(t => {
    test.strictSame(t, [i, array[i + 1]]);
    i++;
  });
});

metatests.testSync('Iterator.join default', test => {
  const actual = iter(array).join();
  test.strictSame(actual, '1,2,3,4');
});

metatests.testSync('Iterator.join', test => {
  const actual = iter(array).join(', ');
  test.strictSame(actual, '1, 2, 3, 4');
});

metatests.testSync('Iterator.join with prefix', test => {
  const actual = iter(array).join(', ', 'a = ');
  test.strictSame(actual, 'a = 1, 2, 3, 4');
});

metatests.testSync('Iterator.join with suffix', test => {
  const actual = iter(array).join(', ', '', ' => 10');
  test.strictSame(actual, '1, 2, 3, 4 => 10');
});

metatests.testSync('Iterator.join with prefix and suffix', test => {
  const actual = iter(array).join(', ', '[', ']');
  test.strictSame(actual, '[1, 2, 3, 4]');
});

metatests.testSync('Iterator.join on empty iterator', test => {
  const actual = iter([]).join(',', 'prefix', 'suffix');
  test.strictSame(actual, 'prefixsuffix');
});

metatests.testSync('RangeIterator with start and stop', test => {
  const actual = Iterator.range(1, 5).toArray();
  test.strictSame(actual, [1, 2, 3, 4]);
});

metatests.testSync('RangeIterator with start, stop and step', test => {
  const actual = Iterator.range(1, 6, 2).toArray();
  test.strictSame(actual, [1, 3, 5]);
});

metatests.testSync('RangeIterator without start', test => {
  const actual = Iterator.range(5).toArray();
  test.strictSame(actual, [0, 1, 2, 3, 4]);
});

metatests.testSync('RangeIterator reverse', test => {
  const actual = Iterator.range(4, -1, -1).toArray();
  test.strictSame(actual, [4, 3, 2, 1, 0]);
});

metatests.testSync('RangeIterator empty range', test => {
  const actual = Iterator.range(0).toArray();
  test.strictSame(actual, []);
});

metatests.testSync('RangeIterator empty range with start > stop', test => {
  const actual = Iterator.range(1, 0).toArray();
  test.strictSame(actual, []);
});

metatests.testSync('Iterator.toObject simple', test => {
  const actual = iter([
    ['a', 1],
    ['b', 2],
    ['c', 3],
  ]).toObject();
  test.strictSame(actual, { a: 1, b: 2, c: 3 });
});

metatests.testSync('Iterator.toObject empty', test => {
  const actual = iter([]).toObject();
  test.strictSame(actual, {});
});

metatests.testSync('Iterator.toObject with map', test => {
  const actual = Iterator.range(0, 3)
    .map(i => [String.fromCharCode(97 + i), i])
    .toObject();
  test.strictSame(actual, { a: 0, b: 1, c: 2 });
});

metatests.testSync("Iterator.toObject with '0', '1' properties", test => {
  // According to spec https://tc39.github.io/ecma262/#sec-add-entries-from-iterable
  const actual = Iterator.range(0, 3)
    .map(i => ({ 0: String.fromCharCode(97 + i), 1: i }))
    .toObject();
  test.strictSame(actual, { a: 0, b: 1, c: 2 });
});

metatests.testSync('Iterator.apply', test => {
  const actual = Iterator.range(1, 3).apply(([a, b]) => a + b);
  test.strictSame(actual, 3);
});

metatests.testSync('Iterator.chainApply', test => {
  const actual = Iterator.range(1, 3)
    .chainApply(([a, b]) => [a + b, a - b])
    .join();
  test.strictSame(actual, '3,-1');
});

metatests.testSync('Iterator.chainApply on false result', test => {
  const actual = Iterator.range(1, 3)
    .chainApply(() => false)
    .toArray();
  test.strictSame(actual, [false]);
});

metatests.testSync('Iterator.chainApply on non-iterable result', test => {
  const actual = Iterator.range(1, 3)
    .chainApply(() => ({ a: 42 }))
    .toArray();
  test.strictSame(actual, [{ a: 42 }]);
});

metatests.testSync('Iterator.chainApply on string', test => {
  const actual = iter([])
    .chainApply(() => 'hello')
    .join(' ');
  test.strictSame(actual, 'h e l l o');
});

metatests.testSync('Iterator.max no values', test => {
  const actual = iter([]).max();
  test.strictSame(actual, undefined);
});

metatests.testSync('Iterator.max simple', test => {
  const actual = iter([1, 2, 3, 4, 5]).max();
  test.strictSame(actual, 5);
});

metatests.testSync('Iterator.max accessor', test => {
  const arr = [{ val: 5 }, { val: 4 }, { val: 3 }, { val: 9 }, { val: 4 }];
  const actual = iter(arr).max(v => v.val);
  test.strictSame(actual, arr[3]);
});

metatests.testSync('Iterator.max accessor this', test => {
  class Arr extends Array {
    constructor(offset, val) {
      super(...val);
      this.offset = offset;
    }

    getVal(val) {
      return this.offset * val;
    }
  }
  const arr = new Arr(-1, [5, 4, 3, 2, 1]);
  const actual = iter(arr).max(arr.getVal, arr);
  test.strictSame(actual, 1);
});

metatests.testSync('Iterator.min no values', test => {
  const actual = iter([]).min();
  test.strictSame(actual, undefined);
});

metatests.testSync('Iterator.min simple', test => {
  const actual = iter([1, 2, 3, 4, 5]).min();
  test.strictSame(actual, 1);
});

metatests.testSync('Iterator.min accessor', test => {
  const arr = [{ val: 5 }, { val: 4 }, { val: 3 }, { val: 9 }, { val: 4 }];
  const actual = iter(arr).min(v => v.val);
  test.strictSame(actual, arr[2]);
});

metatests.testSync('Iterator.min accessor this', test => {
  class Arr extends Array {
    constructor(offset, val) {
      super(...val);
      this.offset = offset;
    }

    getVal(val) {
      return this.offset * val;
    }
  }
  const arr = new Arr(-1, [1, 2, 3, 4, 5]);
  const actual = iter(arr).min(arr.getVal, arr);
  test.strictSame(actual, 5);
});

metatests.testSync('Iterator.findCompare no values', test => {
  const actual = iter([]).findCompare();
  test.strictSame(actual, undefined);
});

metatests.testSync('Iterator.findCompare simple', test => {
  const actual = iter([1, 2, 3, 4, 5]).findCompare(
    (curr, next) => curr === undefined || next < 3
  );
  test.strictSame(actual, 2);
});

metatests.testSync('Iterator.findCompare accessor', test => {
  const arr = [{ val: 5 }, { val: 4 }, { val: 3 }, { val: 9 }, { val: 4 }];
  const actual = iter(arr).findCompare(
    (curr, next) => curr === undefined || Math.abs(curr - next) < 2,
    v => v.val
  );
  test.strictSame(actual, arr[4]);
});

metatests.testSync('Iterator.findCompare accessor this', test => {
  class Arr extends Array {
    constructor(offset, val) {
      super(...val);
      this.offset = offset;
    }

    getVal(val) {
      return this.offset * val;
    }
  }
  const arr = new Arr(-1, [1, 2, 3, 4, 5]);
  const actual = iter(arr).findCompare(
    (curr, next) => curr === undefined || next < 0,
    arr.getVal,
    arr
  );
  test.strictSame(actual, 5);
});

metatests.testSync('Iterator.groupBy empty', test => {
  const actual = iter([]).groupBy(v => v % 2);
  test.type(actual, 'Map');
  test.strictSame(Array.from(actual), Array.from(new Map()));
});

metatests.testSync('Iterator.groupBy numbers', test => {
  const actual = iter([1, 2, 3, 4, 5]).groupBy(v => v % 2);
  test.type(actual, 'Map');
  test.strictSame(
    Array.from(actual),
    Array.from(
      new Map([
        [1, [1, 3, 5]],
        [0, [2, 4]],
      ])
    )
  );
});

metatests.testSync('Iterator.groupBy strings', test => {
  const actual = iter([1, 2, 3, 4, 5]).groupBy(v => (v % 2).toString());
  test.type(actual, 'Map');
  test.strictSame(
    Array.from(actual),
    Array.from(
      new Map([
        ['1', [1, 3, 5]],
        ['0', [2, 4]],
      ])
    )
  );
});

metatests.testSync('Iterator.groupBy objects', test => {
  const even = { type: 'even' };
  const odd = { type: 'odd' };
  const actual = iter([1, 2, 3, 4, 5]).groupBy(v => (v % 2 === 0 ? even : odd));
  test.type(actual, 'Map');
  test.strictSame(
    Array.from(actual),
    Array.from(
      new Map([
        [odd, [1, 3, 5]],
        [even, [2, 4]],
      ])
    )
  );
});

metatests.testSync('Iterator.groupBy thisArg', test => {
  const actual = iter([1, 2, 3, 4, 5]).groupBy(
    function(v) {
      return v % this.radix;
    },
    { radix: 2 }
  );
  test.type(actual, 'Map');
  test.strictSame(
    Array.from(actual),
    Array.from(
      new Map([
        [1, [1, 3, 5]],
        [0, [2, 4]],
      ])
    )
  );
});

metatests.testSync('Iterator.indices on empty array', test => {
  const actual = Iterator.indices([]).toArray();
  test.strictSame(actual, []);
});

metatests.testSync('Iterator.indices on array', test => {
  const actual = Iterator.indices([1, 2, 3]).toArray();
  test.strictSame(actual, [0, 1, 2]);
});

metatests.testSync('Iterator.indices on object with length', test => {
  const actual = Iterator.indices({ length: 4 }).toArray();
  test.strictSame(actual, [0, 1, 2, 3]);
});

metatests.testSync('Iterator.last empty', test => {
  const actual = iter([]).last();
  test.strictSame(actual, undefined);
});

metatests.testSync('Iterator.last numbers', test => {
  const actual = iter([1, 2, 3, 4]).last();
  test.strictSame(actual, 4);
});

metatests.testSync('Iterator.last objects', test => {
  const actual = iter([{ a: 1 }, { a: 2 }, { a: 42 }]).last();
  test.strictSame(actual, { a: 42 });
});

metatests.testSync('Iterator.last with default', test => {
  const actual = iter([]).last(42);
  test.strictSame(actual, 42);
});

metatests.testSync('Iterator.firstNonNullable empty', test => {
  const actual = iter([]).firstNonNullable();
  test.strictSame(actual, undefined);
});

metatests.testSync('Iterator.firstNonNullable empty with default', test => {
  const actual = iter([]).firstNonNullable(42);
  test.strictSame(actual, 42);
});

metatests.testSync('Iterator.firstNonNullable simple', test => {
  const actual = iter([null, 1, undefined, 2, 3]).firstNonNullable();
  test.strictSame(actual, 1);
});

metatests.testSync('Iterator.firstNonNullable none', test => {
  const actual = iter([null, undefined, null]).firstNonNullable('42');
  test.strictSame(actual, '42');
});

metatests.testSync('iterEntries must iterate over object entries', test => {
  const source = { a: 13, b: 42, c: 'hello' };
  test.strictSame(iterEntries(source).toArray(), Object.entries(source));
});

metatests.testSync('iterKeys must iterate over object keys', test => {
  const source = { a: 13, b: 42, c: 'hello' };
  test.strictSame(iterKeys(source).toArray(), Object.keys(source));
});

metatests.testSync('iterValues must iterate over object values', test => {
  const source = { a: 13, b: 42, c: 'hello' };
  test.strictSame(iterValues(source).toArray(), Object.values(source));
});
