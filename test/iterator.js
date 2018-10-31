'use strict';

const metatests = require('metatests');
const { Iterator, iter } = require('..');

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

metatests.test('Iterator.count', test => {
  test.strictSame(iter(array).count(), array.length);
  test.end();
});

metatests.test('Iterator.count on consumed iterator', test => {
  test.strictSame(iter(array).skip(array.length).count(), 0);
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
  test.strictSame(iter(array).reduce((acc, current) => acc + current, 0), 10);
  test.end();
});

metatests.test('Iterator.reduce with no initialValue', test => {
  test.strictSame(iter(array).reduce((acc, current) => acc + current), 10);
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

metatests.test('Iterator.zip', test => {
  const it = iter(array);
  const itr = iter(array).take(3);
  const iterator = iter(array).take(2);
  test.strictSame(it.zip(itr, iterator).toArray(), [[1, 1, 1], [2, 2, 2]]);
  test.end();
});

metatests.test('Iterator.join', test => {
  const it = iter(array).take(1);
  const itr = iter(array)
    .skip(1)
    .take(1);
  const iterator = iter(array)
    .skip(2)
    .take(2);
  test.strictSame(it.join(itr, iterator).toArray(), [1, 2, 3, 4]);
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
  test.strictSame(iter(array).find(element => element % 2 === 0), 2);
  test.end();
});

metatests.test('Iterator.find that must not find an element', test => {
  test.strictSame(iter(array).find(element => element > 4), undefined);
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

metatests.test(
  'Iterator.collectTo must collect to given Collection',
  test => {
    const set = iter(array).collectTo(Set);
    test.strictSame([...set.values()], array);
    test.end();
  }
);

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

metatests.testSync('Iterator.enumerate must return tuples', test => {
  let i = 0;
  iter(array).enumerate().forEach(t => {
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
