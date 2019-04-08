# Metarhia Common Library

[![TravisCI](https://travis-ci.org/metarhia/common.svg?branch=master)](https://travis-ci.org/metarhia/common)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/57f219ad89e64c848685a93f5f2f14c2)](https://www.codacy.com/app/metarhia/common)
[![NPM Version](https://badge.fury.io/js/%40metarhia%2Fcommon.svg)](https://badge.fury.io/js/%40metarhia%2Fcommon)
[![NPM Downloads/Month](https://img.shields.io/npm/dm/@metarhia/common.svg)](https://www.npmjs.com/package/@metarhia/common)
[![NPM Downloads](https://img.shields.io/npm/dt/@metarhia/common.svg)](https://www.npmjs.com/package/@metarhia/common)

Namespace: `api.common` in [Impress Application Server](https://github.com/metarhia/Impress)

## Installation

```bash
$ npm install @metarhia/common
```

## API

### splitAt(index, array)

- `index`: [`<number>`][number] index defining end of first part and start of
  second
- `array`: [`<Array>`][array] to be split

_Returns:_ [`<Array>`][array] tuple with two parts of the array

Split array into two parts

### shuffle(arr)

- `arr`: [`<Array>`][array]

_Returns:_ [`<Array>`][array]

Shuffle an array

### range(from, to)

- `from`: [`<number>`][number] range start
- `to`: [`<number>`][number] range end

_Returns:_ [`<Array>`][array]

Generate int array from given range

_Example:_

```js
range(1, 5);
```

_Result:_

```js
[1, 2, 3, 4, 5];
```

### sequence(seq\[, max\])

- `seq`: [`<Array>`][array]
- `max`: [`<number>`][number] (optional), max

_Returns:_ [`<Array>`][array]

Generate int array from sequence syntax

_Example:_

```js
list: sequence([81, 82, 83]);
```

_Result:_

```js
[81, 82, 83];
```

_Example:_

```js
range from..to: sequence([81,,83]) = [81, 82, 83];
```

_Result:_

```js
[81, 82, 83];
```

_Example:_

```js
range from..count: sequence([81, [3]]) = [81, 82, 83];
```

_Result:_

```js
[81, 82, 83];
```

_Example:_

```js
range from..max-to: sequence([81, [-2]], 5) = [81, 82, 83];
```

_Result:_

```js
[81, 82, 83];
```

### last(arr)

- `arr`: [`<Array>`][array]

_Returns:_ `<any>` element

Get last element of array

### pushSame(arr, n, value)

- `arr`: [`<Array>`][array]
- `n`: [`<number>`][number]
- `value`: `<any>`

_Returns:_ [`<number>`][number] new value of arr.length

Push single value multiple times

### checkLogin(login, required\[, optional\])

- `login`: [`<string>`][string] login to test
- `required`: [`<Array>`][array] required tests configs
- `optional`: [`<Array>`][array] optional tests configs, defalult: `[]`

_Returns:_ `<AuthenticationStrength>`

Function that tests the login

### checkPassword(password, required\[, optional\])

- `password`: [`<string>`][string] password to test
- `required`: [`<Array>`][array] required tests configs
- `optional`: [`<Array>`][array] optional tests configs, default: `[]`

_Returns:_ `<AuthenticationStrength>`

Function that tests the password

### checkLoginPassword(login, password, required\[, optional\])

- `login`: [`<string>`][string] login to test
- `password`: [`<string>`][string] password to test
- `required`: [`<Array>`][array] required tests configs
- `optional`: [`<Array>`][array] optional tests configs, default: `[]`

_Returns:_ `<AuthenticationStrength>`

Function that tests the login with password

### class BTree

#### BTree.prototype.constructor(degree = DEFAULT\_DEGREE)

#### BTree.prototype.get(key)

#### BTree.prototype.set(key, data)

#### BTree.prototype.iterator(start, finish)

#### BTree.prototype.remove(key)

### cache()

_Returns:_ `<Cache>`

Create Cache, enhanced Map

### class Cache

#### Cache.super\_()

#### Cache.prototype.constructor()

#### Cache.prototype.add(key, val)

- `key`: [`<string>`][string] key
- `val`: `<any>` associated value

Add key-value pair to cache

#### Cache.prototype.del(key)

- `key`: [`<string>`][string] key

Delete cache element

#### Cache.prototype.clr(prefix\[, fn\])

- `prefix`: [`<string>`][string] to compare with beginning of the key
- `fn`: [`<Function>`][function] (optional)
  - `key`: [`<string>`][string] key
  - `val`: `<any>` associative value to be called on each key

Clear cache elements that start with prefix

### falseness()

_Returns:_ [`<boolean>`][boolean] always `false`

Empty function

### trueness()

_Returns:_ [`<boolean>`][boolean] always `true`

Empty function

### emptiness()

Empty function

### nop(callback)

- `callback`: [`<Function>`][function] callback to be called with (null)

Empty asynchronous callback-last single-argument function

### noop(empty, callback)

- `empty`: `<any>` incoming value to be ignored
- `callback`: [`<Function>`][function] callback to be called with (null, null)

Empty asynchronous callback-last double-argument function

### once(\[fn\])

- `fn`: [`<Function>`][function] (optional)

_Returns:_ [`<Function>`][function] function(...args) wrapped callback

- `args`: [`<Array>`][array]

Wrap function: call once, not null

### cb(...args)

### unsafeCallback(args)

- `args`: [`<Array>`][array] arguments

_Returns:_ [`<Function>`][function]|[`<null>`][null] callback if any

Extract callback function

It's unsafe: may return null, allows multiple calls

### extractCallback(...args)

### cbUnsafe(...args)

### safeCallback(args)

- `args`: [`<Array>`][array] arguments

_Returns:_ [`<Function>`][function] callback or common.emptiness if there is no
callback

Extract callback

### cbExtract(...args)

### requiredCallback(args)

- `args`: [`<Array>`][array] arguments

_Returns:_ [`<Function>`][function] extracted callback

Extract callback

_Throws:_ [`<TypeError>`][typeerror] if there is no callback

### onceCallback(args)

- `args`: [`<Array>`][array] arguments

_Returns:_ [`<Function>`][function] callback or common.emptiness if there is no
callback

Extract callback and make it safe

Wrap callback with once()

### safeFunction(fn)

- `fn`: [`<Function>`][function]

_Returns:_ [`<Function>`][function] function or `common.emptiness` if fn is not
a function

Check function and make it safe

### unsafeFunction(fn)

- `fn`: [`<Function>`][function]

_Returns:_ [`<Function>`][function]|[`<null>`][null] function or null if fn is
not a function

Check function

### id(x)

- `x`: `<any>` incoming value which will be returned

_Returns:_ `<any>` incoming value

Identity function

### asyncId(x, callback)

- `x`: `<any>` incoming value which will be returned into the callback
- `callback`: [`<Function>`][function] callback to be called with first argument
  - `err`: [`<null>`][null]
  - `data`: `<any>`

Async identity function

### isScalar(value)

- `value`: `<any>`

_Returns:_ [`<boolean>`][boolean]

Check if value is scalar

### copy(ds)

- `ds`: [`<Object[]>`][object] source dataset to be copied

_Returns:_ [`<Object[]>`][object]

Copy dataset (copy objects to new array)

### clone(obj)

- `obj`: [`<Object>`][object]|[`<Array>`][array]

_Returns:_ [`<Object>`][object]|[`<Array>`][array]

Clone object or array

### duplicate(obj)

- `obj`: [`<Object>`][object]|[`<Array>`][array]

_Returns:_ [`<Object>`][object]|[`<Array>`][array]

Duplicate object or array (properly handles prototype and circular links)

### getByPath(data, dataPath)

- `data`: [`<Object>`][object]
- `dataPath`: [`<string>`][string] dot-separated path

_Returns:_ `<any>` value

Read property by dot-separated path

### setByPath(data, dataPath, value)

- `data`: [`<Object>`][object]
- `dataPath`: [`<string>`][string] dot-separated path
- `value`: `<any>` new value

Set property by dot-separated path

### deleteByPath(data, dataPath)

- `data`: [`<Object>`][object]
- `dataPath`: [`<string>`][string] dot-separated path

_Returns:_ [`<boolean>`][boolean]

Delete property by dot-separated path

### merge(...args)

- `args`: [`<Array[]>`][array] arrays with elements to be merged

_Returns:_ [`<Array>`][array]

Distinctly merge multiple arrays

### mergeObjects(merger, ...objs)

- `merger`: [`<Function>`][function]
- `objs`: [`<Object[]>`][object] objects to be merged

_Returns:_ [`<Object>`][object]

Merge multiple objects with merger

### class Enum

#### Enum.from(...args)

#### Enum.NaE()

#### Enum.prototype.constructor(...args)

### forwardEvents(from, to\[, events\])

- `from`: [`<EventEmitter>`][eventemitter] to listen for event
- `to`: [`<EventEmitter>`][eventemitter] to emit event on
- `events`: [`<string>`][string]|[`<Object>`][object]|[`<string[]>`][string]
  (optional), events names

Forward events from one EventEmitter to another

_Example:_

```js
forwardEvents(from, to);
```

_Example:_

```js
forwardEvents(from, to, 'eventName');
```

_Example:_

```js
forwardEvents(from, to, { eventName: 'newEventName' });
```

_Example:_

```js
forwardEvents(from, to, ['eventName1', 'eventName2']);
```

### emitter()

_Returns:_ [`<EventEmitter>`][eventemitter]

Create EnhancedEmitter, enhanced EventEmitter

with wildcard and forward method

### class EnhancedEmitter

#### EnhancedEmitter.super\_()

#### EnhancedEmitter.prototype.constructor()

#### EnhancedEmitter.prototype.emit(...args)

- `args`: [`<Array>`][array] arguments to be passed

Call listener with provided arguments

#### EnhancedEmitter.prototype.forward(to, events)

- `to`: [`<EventEmitter>`][eventemitter] to emit event on
- `events`: [`<string>`][string]|[`<Object>`][object]|[`<string[]>`][string]
  events names

Forward events from one EventEmitter to another

### class Flags

#### Flags.from(...args)

#### Flags.prototype.constructor(...args)

### partial(fn, ...args)

- `fn`: [`<Function>`][function]
- `args`: [`<Array>`][array] arguments to be applied

_Returns:_ [`<Function>`][function] function(...rest)

- `rest`: [`<Array>`][array] arguments

Partially apply arguments to function

### omap(mapFn, obj)

- `mapFn`: [`<Function>`][function] to apply to every field value
- `obj`: [`<Object>`][object] which fields used for mapping

_Returns:_ [`<Object>`][object] with same reference but with transformed fields

Map object fields with provided function

### compose(...fns)

- `fns`: [`<Array>`][array] functions to be composed

_Returns:_ [`<Function>`][function] function(...args), composed

- `args`: [`<Array>`][array] arguments to be passed to the first function

Compose multiple functions into one

### maybe(fn, defVal\[, value\])

- `fn`: [`<Function>`][function]
- `defVal`: `<any>` default value
- `value`: `<any>` (optional), value

_Returns:_ `<any>` result of `fn` or `defVal`

Apply given function to value or default value

### zip(...arrays)

- `arrays`: [`<Array[]>`][array] arrays to be zipped

_Returns:_ [`<Array>`][array] length is minimal of input arrays length, element
with index i of resulting array is array with elements with index i from input
array

Zip several arrays into one

### replicate(count, elem)

- `count`: [`<number>`][number] new array length
- `elem`: `<any>` value to replicate

_Returns:_ [`<Array>`][array] replicated

Create array of replicated values

### zipWith(fn, ...arrays)

- `fn`: [`<Function>`][function] for zipping elements with index i
- `arrays`: [`<Array[]>`][array] arrays to be zipped

_Returns:_ [`<Array>`][array] zipped, element with index i of resulting array is
result of fn called with arguments from arrays

Zip arrays using specific function

### curryUntil(condition, fn, ...args)

- `condition`: [`<Function>`][function] returns: [`<boolean>`][boolean]
  - `argsI`: [`<Array>`][array] arguments for i-th currying
  - `argsParts`: [`<Array>`][array] of args given for currying from first to
    i-th currying
- `fn`: [`<Function>`][function] to be curried
- `args`: [`<Array>`][array] arguments for fn

_Returns:_ [`<Function>`][function] function(...args), curried

- `args`: [`<Array>`][array] arguments

Curry function until the condition is met

### curryN(fn, count, ...args)

- `fn`: [`<Function>`][function] to be curried
- `count`: [`<number>`][number] of times function should be curried
- `args`: [`<Array>`][array] arguments for first currying

_Returns:_ [`<Function>`][function] curried given times count

Curry fn count times, first curry uses args for first currying

### curryTwice(fn)

- `fn`: [`<Function>`][function] to be curried

_Returns:_ [`<Function>`][function] to pass arguments that returns curried fn

Curry function curry with fn

### curry(fn, ...param)

- `fn`: [`<Function>`][function] to be curried
- `param`: [`<Array>`][array] arguments to the function

_Returns:_ [`<Function>`][function] function(...args), curried

Curry function with given arguments

### applyArgs(...args)

- `args`: [`<Array>`][array] arguments to save in closure

_Returns:_ [`<Function>`][function] returns: `<any>`, result of `fn(...args)`

- `fn`: [`<Function>`][function] to be applied saved arguments

Apply arguments

### either(fn)

- `fn`: [`<Function>`][function] to be called

_Returns:_ [`<Function>`][function] function(...args), returns: `<any>`, result
of `fn(arg)`, where `arg` - first valid element of `args`

- `args`: [`<Array>`][array] arguments to iterate

Get first not errored result of fn

_Throws:_ [`<Error>`][error] if `fn` throws it

### restLeft(fn)

- `fn`: [`<Function>`][function] function(args, ...namedArgs, callback)
  - `args`: [`<Array>`][array] rest of spreadArgs created by excluding namedArgs
  - `namedArgs`: [`<Array>`][array] first values of spreadArgs, length is based
    upon interface of fn
  - `callback`: [`<Function>`][function] callback, last argument of spreadArgs

_Returns:_ [`<Function>`][function] function(...spreadArgs)

- `spreadArgs`: [`<Array>`][array] arguments to be added

Rest left, transform function

### mkdirp(dir, mode, cb)

### rmdirp(dir, cb)

### generateKey(length, possible)

- `length`: [`<number>`][number] key length
- `possible`: [`<string>`][string] with possible characters

_Returns:_ [`<string>`][string] key

Generate random key

### generateGUID()

_Returns:_ [`<string>`][string] GUID

Generate an RFC4122-compliant GUID (UUID v4)

### generateSID(config)

- `config`: [`<Object>`][object] { length, characters, secret }

_Returns:_ [`<string>`][string] SID

Generate random SID

_Deprecated:_ this method will be removed in the next major versions. Use
`generateToken()` instead.

### crcSID(config, key)

- `config`: [`<Object>`][object] { secret }
- `key`: [`<string>`][string] SID key

_Returns:_ [`<string>`][string] CRC

Calculate SID CRC

_Deprecated:_ this method will be removed in the next major versions. Use
`crcToken()` instead.

### validateSID(config, sid)

- `config`: [`<Object>`][object] { secret }
- `sid`: [`<string>`][string] session id

_Returns:_ [`<boolean>`][boolean]

Validate SID

_Deprecated:_ this method will be removed in the next major versions. Use
`validateToken()` instead.

### generateToken(secret, characters, length)

- `secret`: [`<string>`][string]
- `characters`: [`<string>`][string]
- `length`: [`<number>`][number]

_Returns:_ [`<string>`][string] token

Generate random Token

### crcToken(secret, key)

- `secret`: [`<string>`][string]
- `key`: [`<string>`][string]

_Returns:_ [`<string>`][string] crc

Calculate Token crc

### validateToken(secret, token)

- `secret`: [`<string>`][string]
- `token`: [`<string>`][string]

_Returns:_ [`<boolean>`][boolean]

Validate Token

### hash(password, salt)

- `password`: [`<string>`][string]
- `salt`: [`<string>`][string]

_Returns:_ [`<string>`][string] hash

Calculate hash with salt

### validateHash(hashValue, password, salt)

- `hashValue`: [`<string>`][string]
- `password`: [`<string>`][string]
- `salt`: [`<string>`][string]

_Returns:_ [`<boolean>`][boolean]

Validate hash

### generateStorageKey()

_Returns:_ [`<string[]>`][string] [folder1, folder2, code]

Generate file storage key

### idToChunks(id)

- `id`: [`<number>`][number]

_Returns:_ [`<Array>`][array] minimal length is 2 which contains hex strings
with length of 4

Convert id to array of hex strings

### idToPath(id)

- `id`: [`<number>`][number]

_Returns:_ [`<string>`][string]

Convert id to file path

### pathToId(path)

- `path`: [`<string>`][string]

_Returns:_ [`<number>`][number]

Convert file path to id

### class Int64

#### Int64.zero()

#### Int64.one()

#### Int64.\_conversion(value)

Convert signed to 2's complement representation and vise versa

#### Int64.add(a, b)

#### Int64.sub(a, b)

#### Int64.cmp(a, b)

#### Int64.\_division(n, d)

#### Int64.div(a, b)

#### Int64.mod(a, b)

#### Int64.mult(a, b)

#### Int64.and(a, b)

#### Int64.or(a, b)

#### Int64.not(a)

#### Int64.xor(a, b)

#### Int64.shiftRight(a, b)

#### Int64.shiftLeft(a, b)

#### Int64.prototype.constructor(value)

#### Int64.prototype.toInt32()

#### Int64.prototype.toUint32()

#### Int64.prototype.add(b)

#### Int64.prototype.sub(b)

#### Int64.prototype.and(b)

#### Int64.prototype.or(b)

#### Int64.prototype.not()

#### Int64.prototype.xor(b)

#### Int64.prototype.shiftRightLogical(b)

#### Int64.prototype.shiftRightArithmetic(b)

#### Int64.prototype.shiftRight(b)

#### Int64.prototype.shiftLeft(b)

#### Int64.prototype.inc()

#### Int64.prototype.dec()

#### Int64.prototype.toString(radix = 10)

#### Int64.prototype.toJSON()

#### Int64.prototype.toPostgres()

### class Iterator

#### Iterator.range(start, stop\[, step\])

- `start`: [`<number>`][number]
- `stop`: [`<number>`][number]
- `step`: [`<number>`][number] (optional), default: `1`

_Returns:_ `<Iterator>`

Create iterator iterating over the range

#### Iterator.prototype.constructor(base)

#### Iterator.prototype.next()

#### Iterator.prototype.count()

#### Iterator.prototype.each(fn, thisArg)

#### Iterator.prototype.forEach(fn, thisArg)

#### Iterator.prototype.every(predicate, thisArg)

#### Iterator.prototype.find(predicate, thisArg)

#### Iterator.prototype.includes(element)

#### Iterator.prototype.reduce(reducer, initialValue)

#### Iterator.prototype.some(predicate, thisArg)

#### Iterator.prototype.someCount(predicate, count, thisArg)

#### Iterator.prototype.collectTo(CollectionClass)

#### Iterator.prototype.collectWith(obj, collector)

#### Iterator.prototype.toArray()

#### Iterator.prototype.map(mapper, thisArg)

#### Iterator.prototype.filter(predicate, thisArg)

#### Iterator.prototype.flat(depth = 1)

#### Iterator.prototype.flatMap(mapper, thisArg)

#### Iterator.prototype.zip(...iterators)

#### Iterator.prototype.chain(...iterators)

#### Iterator.prototype.take(amount)

#### Iterator.prototype.takeWhile(predicate, thisArg)

#### Iterator.prototype.skip(amount)

#### Iterator.prototype.enumerate()

#### Iterator.prototype.join(sep = ', ', prefix = '', suffix = '')

### iter(base)

### cryptoPrefetcher(bufSize, valueSize)

- `bufSize`: [`<number>`][number] size in bytes of the buffer to preallocate
- `valueSize`: [`<number>`][number] size in bytes of the produced chunks

Create prefetcher to use when crypto.randomBytes is required to generate

multiple same-size values. `bufSize` must be a multiple of `valueSize` for this
to work.

### random(min, max)

- `min`: [`<number>`][number] range start
- `max`: [`<number>`][number] range end

_Returns:_ [`<number>`][number]

Generate random integer value in given range

### cryptoRandom()

_Returns:_ [`<number>`][number]

Generate random number in the range from 0 inclusive up to

but not including 1 (same as Math.random), using crypto-secure number generator.

### methods(iface)

- `iface`: [`<Object>`][object] to be introspected

_Returns:_ [`<string[]>`][string] method names

List method names

### properties(iface)

- `iface`: [`<Object>`][object] to be introspected

_Returns:_ [`<string[]>`][string] property names

List property names

### ip2int(...args)

### ipToInt(\[ip\])

- `ip`: [`<string>`][string] (optional), default: '127.0.0.1', IP address

_Returns:_ [`<number>`][number]

Convert IP string to number

### localIPs()

_Returns:_ [`<string[]>`][string]

Get local network interfaces

### parseHost(host)

- `host`: [`<string>`][string] host or empty string, may contain `:port`

_Returns:_ [`<string>`][string] host without port but not empty

Parse host string

### inherits(child, base)

### override(obj, fn)

- `obj`: [`<Object>`][object] containing method to override
- `fn`: [`<Function>`][function] name will be used to find method

Override method: save old to `fn.inherited`

Previous function will be accessible by obj.fnName.inherited

### mixin(target, source)

- `target`: [`<Object>`][object] mixin to target
- `source`: [`<Object>`][object] source methods

Mixin for ES6 classes without overriding existing methods

### class Pool

#### Pool.prototype.constructor(factory = null)

#### Pool.prototype.put(value)

#### Pool.prototype.get()

### sortComparePriority(priority, s1, s2)

- `priority`: [`<string[]>`][string] with priority
- `s1`: [`<string>`][string] to compare
- `s2`: [`<string>`][string] to compare

_Returns:_ [`<number>`][number]

Compare for array.sort with priority

_Example:_

```js
files.sort(common.sortComparePriority);
```

### sortCompareDirectories(a, b)

- `a`: [`<string>`][string] to compare
- `b`: [`<string>`][string] to compare

_Returns:_ [`<number>`][number]

Compare for array.sort, directories first

_Example:_

```js
files.sort(sortCompareDirectories);
```

### sortCompareByName(a, b)

- `a`: [`<Object>`][object] { name } to compare
- `b`: [`<Object>`][object] { name } to compare

_Returns:_ [`<number>`][number]

Compare for array.sort

_Example:_

```js
files.sort(sortCompareByName);
```

### subst(tpl, data, dataPath, escapeHtml)

- `tpl`: [`<string>`][string] template body
- `data`: [`<Object>`][object] hash, data structure to visualize
- `dataPath`: [`<string>`][string] current position in data structure
- `escapeHtml`: [`<boolean>`][boolean] escape html special characters if true

_Returns:_ [`<string>`][string]

Substitute variables

### htmlEscape(content)

- `content`: [`<string>`][string] to escape

_Returns:_ [`<string>`][string]

Escape html characters

_Example:_

```js
htmlEscape('5>=5') = '5&lt;=5';
```

### fileExt(fileName)

- `fileName`: [`<string>`][string] file name

_Returns:_ [`<string>`][string]

Extract file extension in lower case without dot

_Example:_

```js
fileExt('/dir/file.txt');
```

_Result:_

```js
'txt';
```

### removeExt(fileName)

- `fileName`: [`<string>`][string] file name

_Returns:_ [`<string>`][string]

Remove file extension from file name

_Example:_

```js
fileExt('file.txt');
```

_Result:_

```js
'file';
```

### spinalToCamel(name)

- `name`: [`<string>`][string]

_Returns:_ [`<string>`][string]

Convert spinal case to camel case

### escapeRegExp(s)

- `s`: [`<string>`][string]

_Returns:_ [`<string>`][string]

Escape regular expression control characters

_Example:_

```js
escapeRegExp('/path/to/res?search=this.that');
```

### newEscapedRegExp(s)

- `s`: [`<string>`][string]

_Returns:_ [`<RegExp>`][regexp]

Generate escaped regular expression

### addTrailingSlash(s)

- `s`: [`<string>`][string]

_Returns:_ [`<string>`][string]

Add trailing slash at the end if there isn't one

### stripTrailingSlash(s)

- `s`: [`<string>`][string]

_Returns:_ [`<string>`][string]

Remove trailing slash from string

### dirname(filePath)

- `filePath`: [`<string>`][string]

_Returns:_ [`<string>`][string]

Get directory name with trailing slash from path

### capitalize(s)

- `s`: [`<string>`][string]

_Returns:_ [`<string>`][string]

Capitalize string

### between(s, prefix, suffix)

- `s`: [`<string>`][string] source
- `prefix`: [`<string>`][string] before needed fragment
- `suffix`: [`<string>`][string] after needed fragment

_Returns:_ [`<string>`][string]

Extract substring between prefix and suffix

### removeBOM(s)

- `s`: [`<string>`][string] possibly starts with BOM

_Returns:_ [`<string>`][string]

Remove UTF-8 BOM

### arrayRegExp(items)

- `items`: [`<string[]>`][string]

_Returns:_ [`<RegExp>`][regexp]

Generate RegExp from array with '*' wildcards

_Example:_

```js
['/css/*', '/index.html'];
```

### section(s, separator)

- `s`: [`<string>`][string]
- `separator`: [`<string>`][string] or char

_Returns:_ [`<string[]>`][string]

Split string by the first occurrence of separator

_Example:_

```js
rsection('All you need is JavaScript', 'is');
```

_Result:_

```js
['All you need ', ' JavaScript'];
```

### rsection(s, separator)

- `s`: [`<string>`][string]
- `separator`: [`<string>`][string] or char

_Returns:_ [`<string[]>`][string]

Split string by the last occurrence of separator

_Example:_

```js
rsection('All you need is JavaScript', 'a');
```

_Result:_

```js
['All you need is Jav', 'Script'];
```

### split(s\[, separator\[, limit\]\])

- `s`: [`<string>`][string]
- `separator`: [`<string>`][string] (optional), default: ','
- `limit`: [`<number>`][number] (optional), default: `-1`, max length of result
  array

_Returns:_ [`<string[]>`][string]

Split string by multiple occurrence of separator

_Example:_

```js
split('a,b,c,d');
```

_Result:_

```js
['a', 'b', 'c', 'd'];
```

_Example:_

```js
split('a,b,c,d', ',', 2);
```

_Result:_

```js
['a', 'b'];
```

### rsplit(s\[, separator\[, limit\]\])

- `s`: [`<string>`][string]
- `separator`: [`<string>`][string] (optional), default: ','
- `limit`: [`<number>`][number] (optional), default: `-1`, max length of result
  array

_Returns:_ [`<string[]>`][string]

Split string by multiple occurrences of separator

_Example:_

```js
split('a,b,c,d', ',', 2);
```

_Result:_

```js
['c', 'd'];
```

### normalizeEmail(email)

- `email`: [`<string>`][string] email address to normalize

_Returns:_ [`<string>`][string] normalized email address

Normalize email address according to OWASP recommendations

### isTimeEqual(time1, time2)

- `time1`: [`<string>`][string] time or milliseconds
- `time2`: [`<string>`][string] time or milliseconds

_Returns:_ [`<boolean>`][boolean]

Compare time1 and time2

_Example:_

```js
isTimeEqual(sinceTime, buffer.stats.mtime);
```

### nowDate(\[date\])

- `date`: [`<Date>`][date] (optional), default: `new Date()`

_Returns:_ [`<string>`][string]

Get current date in YYYY-MM-DD format

### nowDateTime(\[date\])

- `date`: [`<Date>`][date] (optional), default: `new Date()`

_Returns:_ [`<string>`][string]

Get current date in YYYY-MM-DD hh:mm format

### class Uint64

#### Uint64.add(a, b)

#### Uint64.sub(a, b)

#### Uint64.mult(a, b)

#### Uint64.cmp(a, b)

#### Uint64.\_division(n, d)

#### Uint64.div(a, b)

#### Uint64.mod(a, b)

#### Uint64.and(a, b)

#### Uint64.or(a, b)

#### Uint64.not(a)

#### Uint64.xor(a, b)

#### Uint64.shiftRight(a, b)

#### Uint64.shiftLeft(a, b)

#### Uint64.prototype.constructor(value)

#### Uint64.prototype.toUint32()

#### Uint64.prototype.add(b)

#### Uint64.prototype.sub(b)

#### Uint64.prototype.and(b)

#### Uint64.prototype.or(b)

#### Uint64.prototype.not()

#### Uint64.prototype.xor(b)

#### Uint64.prototype.shiftRight(b)

#### Uint64.prototype.shiftLeft(b)

#### Uint64.prototype.inc()

#### Uint64.prototype.dec()

#### Uint64.prototype.toString(radix = 10)

#### Uint64.prototype.toJSON()

#### Uint64.prototype.toPostgres()

### duration(s)

- `s`: [`<string>`][string] duration syntax

_Returns:_ [`<number>`][number] milliseconds

Parse duration to seconds

_Example:_

```js
duration('1d 10h 7m 13s');
```

### durationToString(n)

- `n`: [`<number>`][number] duration

_Returns:_ [`<string>`][string]

Convert integer duration to string

### bytesToSize(bytes)

- `bytes`: [`<number>`][number] size

_Returns:_ [`<string>`][string]

Convert integer to string, representing data size in Kb, Mb, Gb, and Tb

### sizeToBytes(size)

- `size`: [`<string>`][string] size

_Returns:_ [`<number>`][number]

Convert string with data size to integer

### deprecate(fn)

- `fn`: [`<Function>`][function]

_Returns:_ [`<Function>`][function] wrapped with deprecation warning

- `args`: [`<Array>`][array] arguments to be passed to wrapped function

Wrap method to mark it as deprecated

### alias(fn)

- `fn`: [`<Function>`][function]

_Returns:_ [`<Function>`][function] wrapped with deprecation warning

- `args`: [`<Array>`][array] arguments to be passed to wrapped function

Wrap new method to mark old alias as deprecated

### safe(fn)

- `fn`: [`<Function>`][function]

_Returns:_ [`<Function>`][function] function(...args), wrapped with try/catch
interception

- `args`: [`<Array>`][array] arguments to be passed to wrapped function

Make function raise-safe

### callerFilename(depth = 0, stack = null)

### callerFilepath(depth = 0, stack = null)

## Contributors

See github for full [contributors list](https://github.com/metarhia/common/graphs/contributors)

[eventemitter]: https://nodejs.org/api/events.html#events_class_eventemitter
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[date]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[regexp]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
[array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[error]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
[typeerror]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type
[null]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
