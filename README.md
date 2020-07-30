# Metarhia Common Library

![CI Status Badge](https://github.com/metarhia/common/workflows/Tests/badge.svg?branch=master)
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

- [splitAt](#splitatindex-array)
- [shuffle](#shufflearr)
- [sample](#samplearr)
- [range](#rangefrom-to)
- [sequence](#sequenceseq-max)
- [last](#lastarr)
- [pushSame](#pushsamearr-n-value)
- [checkLogin](#checkloginlogin-required-optional)
- [checkPassword](#checkpasswordpassword-required-optional)
- [checkLoginPassword](#checkloginpasswordlogin-password-required-optional)
- [BTree](#class-btree)
  - [BTree.prototype.constructor](#btreeprototypeconstructordegree--default_degree)
  - [BTree.prototype.get](#btreeprototypegetkey)
  - [BTree.prototype.iterator](#btreeprototypeiteratorstart-finish)
  - [BTree.prototype.remove](#btreeprototyperemovekey)
  - [BTree.prototype.set](#btreeprototypesetkey-data)
- [cache](#cache)
- [Cache](#class-cache-extends-map)
  - [Cache.prototype.constructor](#cacheprototypeconstructor)
  - [Cache.prototype.add](#cacheprototypeaddkey-val)
  - [Cache.prototype.clr](#cacheprototypeclrprefix-fn)
  - [Cache.prototype.del](#cacheprototypedelkey)
- [falseness](#falseness)
- [trueness](#trueness)
- [emptiness](#emptiness)
- [nop](#nopcallback)
- [noop](#noopempty-callback)
- [once](#oncefn)
- [unsafeCallback](#unsafecallbackargs)
- [safeCallback](#safecallbackargs)
- [requiredCallback](#requiredcallbackargs)
- [onceCallback](#oncecallbackargs)
- [safeFunction](#safefunctionfn)
- [unsafeFunction](#unsafefunctionfn)
- [id](#idx)
- [asyncId](#asyncidx-callback)
- [isScalar](#isscalarvalue)
- [copy](#copyds)
- [clone](#cloneobj)
- [duplicate](#duplicateobj)
- [getByPath](#getbypathdata-datapath)
- [setByPath](#setbypathdata-datapath-value)
- [deleteByPath](#deletebypathdata-datapath)
- [merge](#mergeargs)
- [mergeObjects](#mergeobjectsmerger-objs)
- [Enum](#class-enum)
  - [Enum.from](#enumfromargs)
  - [Enum.prototype.constructor](#enumprototypeconstructor)
- [forwardEvents](#forwardeventsfrom-to-events)
- [emitter](#emitter)
- [EnhancedEmitter](#class-enhancedemitter-extends-eventemitter)
  - [EnhancedEmitter.prototype.constructor](#enhancedemitterprototypeconstructor)
  - [EnhancedEmitter.prototype.emit](#enhancedemitterprototypeemitargs)
  - [EnhancedEmitter.prototype.forward](#enhancedemitterprototypeforwardto-events)
- [Flags](#class-flags)
  - [Flags.from](#flagsfromargs)
  - [Flags.prototype.constructor](#flagsprototypeconstructorargs)
- [partial](#partialfn-args)
- [omap](#omapmapfn-obj)
- [compose](#composefns)
- [maybe](#maybefn-defval-value)
- [zip](#ziparrays)
- [replicate](#replicatecount-elem)
- [zipWith](#zipwithfn-arrays)
- [curryUntil](#curryuntilcondition-fn-args)
- [curryN](#currynfn-count-args)
- [curryTwice](#currytwicefn)
- [curry](#curryfn-param)
- [applyArgs](#applyargsargs)
- [either](#eitherfn)
- [restLeft](#restleftfn)
- [mkdirp](#mkdirpdir-mode-cb)
- [mkdirpPromise](#mkdirppromisedir-mode--mkdirp_default_mode)
- [rmdirp](#rmdirpdir-cb)
- [rmRecursive](#rmrecursivepath-callback)
- [rmRecursivePromise](#async-rmrecursivepromisepath)
- [generateKey](#generatekeylength-possible)
- [generateGUID](#generateguid)
- [generateToken](#generatetokensecret-characters-length)
- [crcToken](#crctokensecret-key)
- [validateToken](#validatetokensecret-token)
- [hash](#hashpassword-salt)
- [validateHash](#validatehashhashvalue-password-salt)
- [generateStorageKey](#generatestoragekey)
- [idToChunks](#idtochunksid)
- [idToPath](#idtopathid)
- [pathToId](#pathtoidpath)
- [Int64](#class-int64)
  - [Int64.add](#int64adda-b)
  - [Int64.and](#int64anda-b)
  - [Int64.cmp](#int64cmpa-b)
  - [Int64.div](#int64diva-b)
  - [Int64.mod](#int64moda-b)
  - [Int64.mult](#int64multa-b)
  - [Int64.not](#int64nota)
  - [Int64.one](#int64one)
  - [Int64.or](#int64ora-b)
  - [Int64.shiftLeft](#int64shiftlefta-b)
  - [Int64.shiftRight](#int64shiftrighta-b)
  - [Int64.sub](#int64suba-b)
  - [Int64.xor](#int64xora-b)
  - [Int64.zero](#int64zero)
  - [Int64.prototype.constructor](#int64prototypeconstructorvalue)
  - [Int64.prototype.add](#int64prototypeaddb)
  - [Int64.prototype.and](#int64prototypeandb)
  - [Int64.prototype.dec](#int64prototypedec)
  - [Int64.prototype.inc](#int64prototypeinc)
  - [Int64.prototype.not](#int64prototypenot)
  - [Int64.prototype.or](#int64prototypeorb)
  - [Int64.prototype.shiftLeft](#int64prototypeshiftleftb)
  - [Int64.prototype.shiftRight](#int64prototypeshiftrightb)
  - [Int64.prototype.shiftRightArithmetic](#int64prototypeshiftrightarithmeticb)
  - [Int64.prototype.shiftRightLogical](#int64prototypeshiftrightlogicalb)
  - [Int64.prototype.sub](#int64prototypesubb)
  - [Int64.prototype.toInt32](#int64prototypetoint32)
  - [Int64.prototype.toJSON](#int64prototypetojson)
  - [Int64.prototype.toPostgres](#int64prototypetopostgres)
  - [Int64.prototype.toString](#int64prototypetostringradix--10)
  - [Int64.prototype.toUint32](#int64prototypetouint32)
  - [Int64.prototype.xor](#int64prototypexorb)
- [Iterator](#class-iterator)
  - [Iterator.indices](#iteratorindicesarr)
  - [Iterator.range](#iteratorrangestart-stop-step)
  - [Iterator.zip](#iteratorzipiterators)
  - [Iterator.prototype.constructor](#iteratorprototypeconstructorbase)
  - [Iterator.prototype.apply](#iteratorprototypeapplyfn)
  - [Iterator.prototype.chain](#iteratorprototypechainiterators)
  - [Iterator.prototype.chainApply](#iteratorprototypechainapplyfn)
  - [Iterator.prototype.collectTo](#iteratorprototypecollecttocollectionclass)
  - [Iterator.prototype.collectWith](#iteratorprototypecollectwithobj-collector)
  - [Iterator.prototype.count](#iteratorprototypecount)
  - [Iterator.prototype.each](#iteratorprototypeeachfn-thisarg)
  - [Iterator.prototype.enumerate](#iteratorprototypeenumerate)
  - [Iterator.prototype.every](#iteratorprototypeeverypredicate-thisarg)
  - [Iterator.prototype.filter](#iteratorprototypefilterpredicate-thisarg)
  - [Iterator.prototype.filterMap](#iteratorprototypefiltermapmapper-thisarg-filtervalue)
  - [Iterator.prototype.find](#iteratorprototypefindpredicate-thisarg)
  - [Iterator.prototype.findCompare](#iteratorprototypefindcomparecomparator-accessor-thisarg)
  - [Iterator.prototype.firstNonNullable](#iteratorprototypefirstnonnullabledefaultvalue)
  - [Iterator.prototype.flat](#iteratorprototypeflatdepth--1)
  - [Iterator.prototype.flatMap](#iteratorprototypeflatmapmapper-thisarg)
  - [Iterator.prototype.forEach](#iteratorprototypeforeachfn-thisarg)
  - [Iterator.prototype.groupBy](#iteratorprototypegroupbyclassifier-thisarg)
  - [Iterator.prototype.includes](#iteratorprototypeincludeselement)
  - [Iterator.prototype.join](#iteratorprototypejoinsep----prefix---suffix--)
  - [Iterator.prototype.last](#iteratorprototypelastdefaultvalue)
  - [Iterator.prototype.map](#iteratorprototypemapmapper-thisarg)
  - [Iterator.prototype.max](#iteratorprototypemaxaccessor-thisarg)
  - [Iterator.prototype.min](#iteratorprototypeminaccessor-thisarg)
  - [Iterator.prototype.next](#iteratorprototypenext)
  - [Iterator.prototype.partition](#iteratorprototypepartitionpredicate-thisarg)
  - [Iterator.prototype.reduce](#iteratorprototypereducereducer-initialvalue)
  - [Iterator.prototype.skip](#iteratorprototypeskipamount)
  - [Iterator.prototype.skipWhile](#iteratorprototypeskipwhilepredicate-thisarg)
  - [Iterator.prototype.some](#iteratorprototypesomepredicate-thisarg)
  - [Iterator.prototype.someCount](#iteratorprototypesomecountpredicate-count-thisarg)
  - [Iterator.prototype.take](#iteratorprototypetakeamount)
  - [Iterator.prototype.takeWhile](#iteratorprototypetakewhilepredicate-thisarg)
  - [Iterator.prototype.toArray](#iteratorprototypetoarray)
  - [Iterator.prototype.toObject](#iteratorprototypetoobject)
  - [Iterator.prototype.zip](#iteratorprototypezipiterators)
- [iter](#iterbase)
- [iterEntries](#iterentriesobj)
- [iterKeys](#iterkeysobj)
- [iterValues](#itervaluesobj)
- [cryptoPrefetcher](#cryptoprefetcherbufsize-valuesize)
- [random](#randommin-max)
- [cryptoRandom](#cryptorandom)
- [methods](#methodsiface)
- [properties](#propertiesiface)
- [ipToInt](#iptointip)
- [localIPs](#localips)
- [parseHost](#parsehosthost)
- [override](#overrideobj-fn)
- [mixin](#mixintarget-source)
- [Pool](#class-pool)
  - [Pool.prototype.constructor](#poolprototypeconstructorfactory--null)
  - [Pool.prototype.get](#poolprototypeget)
  - [Pool.prototype.put](#poolprototypeputvalue)
- [sortComparePriority](#sortcompareprioritypriority-s1-s2)
- [sortCompareDirectories](#sortcomparedirectoriesa-b)
- [sortCompareByName](#sortcomparebynamea-b)
- [MemoryWritable](#class-memorywritable-extends-writable)
  - [MemoryWritable.prototype.constructor](#memorywritableprototypeconstructorsizelimit)
  - [MemoryWritable.prototype.getData](#async-memorywritableprototypegetdataencoding)
- [subst](#substtpl-data-datapath-escapehtml)
- [htmlEscape](#htmlescapecontent)
- [fileExt](#fileextfilename)
- [removeExt](#removeextfilename)
- [spinalToCamel](#spinaltocamelname)
- [escapeRegExp](#escaperegexps)
- [newEscapedRegExp](#newescapedregexps)
- [addTrailingSlash](#addtrailingslashs)
- [stripTrailingSlash](#striptrailingslashs)
- [dirname](#dirnamefilepath)
- [capitalize](#capitalizes)
- [between](#betweens-prefix-suffix)
- [removeBOM](#removeboms)
- [arrayRegExp](#arrayregexpitems)
- [section](#sections-separator)
- [rsection](#rsections-separator)
- [split](#splits-separator-limit)
- [rsplit](#rsplits-separator-limit)
- [normalizeEmail](#normalizeemailemail)
- [isTimeEqual](#istimeequaltime1-time2)
- [nowDate](#nowdatedate)
- [nowDateTime](#nowdatetimedate)
- [Uint64](#class-uint64)
  - [Uint64.add](#uint64adda-b)
  - [Uint64.and](#uint64anda-b)
  - [Uint64.cmp](#uint64cmpa-b)
  - [Uint64.div](#uint64diva-b)
  - [Uint64.mod](#uint64moda-b)
  - [Uint64.mult](#uint64multa-b)
  - [Uint64.not](#uint64nota)
  - [Uint64.or](#uint64ora-b)
  - [Uint64.shiftLeft](#uint64shiftlefta-b)
  - [Uint64.shiftRight](#uint64shiftrighta-b)
  - [Uint64.sub](#uint64suba-b)
  - [Uint64.xor](#uint64xora-b)
  - [Uint64.prototype.constructor](#uint64prototypeconstructorvalue)
  - [Uint64.prototype.add](#uint64prototypeaddb)
  - [Uint64.prototype.and](#uint64prototypeandb)
  - [Uint64.prototype.dec](#uint64prototypedec)
  - [Uint64.prototype.inc](#uint64prototypeinc)
  - [Uint64.prototype.not](#uint64prototypenot)
  - [Uint64.prototype.or](#uint64prototypeorb)
  - [Uint64.prototype.shiftLeft](#uint64prototypeshiftleftb)
  - [Uint64.prototype.shiftRight](#uint64prototypeshiftrightb)
  - [Uint64.prototype.sub](#uint64prototypesubb)
  - [Uint64.prototype.toJSON](#uint64prototypetojson)
  - [Uint64.prototype.toPostgres](#uint64prototypetopostgres)
  - [Uint64.prototype.toString](#uint64prototypetostringradix--10)
  - [Uint64.prototype.toUint32](#uint64prototypetouint32)
  - [Uint64.prototype.xor](#uint64prototypexorb)
- [duration](#durations)
- [durationToString](#durationtostringn)
- [bytesToSize](#bytestosizebytes)
- [sizeToBytes](#sizetobytessize)
- [safe](#safefn)
- [captureMaxStack](#capturemaxstack)
- [callerFilename](#callerfilenamedepth--0-stack--null)
- [callerFilepath](#callerfilepathdepth--0-stack--null)

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

### sample(arr)

- `arr`: [`<Array>`][array]

_Returns:_ `<any>`

Random element from array

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

#### BTree.prototype.iterator(start, finish)

#### BTree.prototype.remove(key)

#### BTree.prototype.set(key, data)

### cache()

_Returns:_ `<Cache>`

Create Cache, enhanced Map

### class Cache extends [Map][map]

#### Cache.prototype.constructor()

#### Cache.prototype.add(key, val)

- `key`: [`<string>`][string] key
- `val`: `<any>` associated value

Add key-value pair to cache

#### Cache.prototype.clr(prefix\[, fn\])

- `prefix`: [`<string>`][string] to compare with beginning of the key
- `fn`: [`<Function>`][function] (optional)
  - `key`: [`<string>`][string] key
  - `val`: `<any>` associative value to be called on each key

Clear cache elements that start with prefix

#### Cache.prototype.del(key)

- `key`: [`<string>`][string] key

Delete cache element

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

### unsafeCallback(args)

- `args`: [`<Array>`][array] arguments

_Returns:_ [`<Function>`][function]|[`<null>`][null] callback if any

Extract callback function

It's unsafe: may return null, allows multiple calls

### safeCallback(args)

- `args`: [`<Array>`][array] arguments

_Returns:_ [`<Function>`][function] callback or common.emptiness if there is no
callback

Extract callback

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
  - `key`: [`<string>`][string] current merging key
  - `...values`: `<any[]>` values under key
- `objs`: [`<Object[]>`][object] objects to be merged

_Returns:_ [`<Object>`][object]

Merge multiple objects with merger

### class Enum

#### Enum.NaE

- `<Symbol>` Not an Enum

#### Enum.from(...args)

#### Enum.prototype.constructor()

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

### class EnhancedEmitter extends [EventEmitter][eventemitter]

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

### mkdirpPromise(dir, mode = MKDIRP\_DEFAULT\_MODE)

### rmdirp(dir, cb)

### rmRecursive(path, callback)

- `path`: [`<string>`][string] path to a file or directory to be removed
- `callback`: [`<Function>`][function] callback

Recursively remove directory

### async rmRecursivePromise(path)

- `path`: [`<string>`][string] path to a file or directory to be removed

_Returns:_ [`<Promise>`][promise]

Recursively remove directory

### generateKey(length, possible)

- `length`: [`<number>`][number] key length
- `possible`: [`<string>`][string] with possible characters

_Returns:_ [`<string>`][string] key

Generate random key

### generateGUID()

_Returns:_ [`<string>`][string] GUID

Generate an RFC4122-compliant GUID (UUID v4)

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

#### Int64.add(a, b)

#### Int64.and(a, b)

#### Int64.cmp(a, b)

#### Int64.div(a, b)

#### Int64.mod(a, b)

#### Int64.mult(a, b)

#### Int64.not(a)

#### Int64.one()

#### Int64.or(a, b)

#### Int64.shiftLeft(a, b)

#### Int64.shiftRight(a, b)

#### Int64.sub(a, b)

#### Int64.xor(a, b)

#### Int64.zero()

#### Int64.prototype.constructor(value)

#### Int64.prototype.add(b)

#### Int64.prototype.and(b)

#### Int64.prototype.dec()

#### Int64.prototype.inc()

#### Int64.prototype.not()

#### Int64.prototype.or(b)

#### Int64.prototype.shiftLeft(b)

#### Int64.prototype.shiftRight(b)

#### Int64.prototype.shiftRightArithmetic(b)

#### Int64.prototype.shiftRightLogical(b)

#### Int64.prototype.sub(b)

#### Int64.prototype.toInt32()

#### Int64.prototype.toJSON()

#### Int64.prototype.toPostgres()

#### Int64.prototype.toString(radix = 10)

#### Int64.prototype.toUint32()

#### Int64.prototype.xor(b)

### class Iterator

#### Iterator.indices(arr)

- `arr`: [`<Array>`][array] array-like object to create indices from

_Returns:_ `<Iterator>`

Create iterator over indices of an array

#### Iterator.range(start, stop\[, step\])

- `start`: [`<number>`][number]
- `stop`: [`<number>`][number]
- `step`: [`<number>`][number] (optional), default: `1`

_Returns:_ `<Iterator>`

Create iterator iterating over the range

#### Iterator.zip(...iterators)

- `iterators`: [`<Array>`][array]

_Returns:_ `<Iterator>`

Create iterator by zipping multiple provided iterators into one

#### Iterator.prototype.constructor(base)

#### Iterator.prototype.apply(fn)

- `fn`: [`<Function>`][function]
  - `this`: `<Iterator>`

_Returns:_ the result of `fn(this)` call.

Call a function with `this`. Will be equivalent to calling `fn(it)`.

#### Iterator.prototype.chain(...iterators)

#### Iterator.prototype.chainApply(fn)

- `fn`: [`<Function>`][function]
  - `this`: `<Iterator>`

_Returns:_ `<Iterator>` result of `fn(this)` wrapped in an Iterator.

Call a function with `this` and wrap the result in an Iterator.

_Example:_

```js
iter([1, 2])
  .chainApply(([a, b]) => [a + b, a - b])
  .join(', ');
```

_Result:_

```js
'3, -1';
```

#### Iterator.prototype.collectTo(CollectionClass)

#### Iterator.prototype.collectWith(obj, collector)

#### Iterator.prototype.count()

#### Iterator.prototype.each(fn, thisArg)

#### Iterator.prototype.enumerate()

#### Iterator.prototype.every(predicate, thisArg)

#### Iterator.prototype.filter(predicate, thisArg)

#### Iterator.prototype.filterMap(mapper\[, thisArg\[, filterValue\]\])

- `mapper`: [`<Function>`][function] function that maps values and returns
  either new value that will be the next value of the new iterator or
  `filterValue` that will be ignored.
  - `value`: `<any>` iterator element
- `thisArg`: `<any>` value to be used as `this` when calling `mapper`
- `filterValue`: `<any>` value to filter out `mapper` results.

Creates an iterator that both filters and maps with the passed `mapper`.

This iterator will call `mapper` on each element and if mapper returns NOT
`filterValue` it will be returned, otherwise it is ignored.

#### Iterator.prototype.find(predicate, thisArg)

#### Iterator.prototype.findCompare(comparator\[, accessor\[, thisArg\]\])

- `comparator`: [`<Function>`][function] returns `true` if new value should be
  accepted
  - `currValue`: `<any>` current value, starts with undefined
  - `nextValue`: `<any>` next value
  - _Returns:_ [`<boolean>`][boolean] `true` if next value should be accepted
- `accessor`: [`<Function>`][function] gets value to compare by, current
  iterator value is used by default
  - `value`: `<any>` current iterator value
  - _Returns:_ `<any>` value to compare by
- `thisArg`: `<any>` value to be used as `this` when calling `accessor` and
  `comparator`

_Returns:_ last iterator value where `comparator` returned `true`,
[`<undefined>`][undefined] by default

Find value in this iterator by comparing every value with

the found one using `comparator`

#### Iterator.prototype.firstNonNullable(\[defaultValue\])

- `defaultValue`: `<any>` value to return if this iterator doesn't have
  non-nullable values
- _Returns:_ first non-nullable value or `<defaultValue>`

Finds first non-nullable value in this iterator

#### Iterator.prototype.flat(depth = 1)

#### Iterator.prototype.flatMap(mapper, thisArg)

#### Iterator.prototype.forEach(fn, thisArg)

#### Iterator.prototype.groupBy(classifier\[, thisArg\])

- `classifier`: [`<Function>`][function] gets value to group by
  - `value`: `<any>` current iterator value
  - _Returns:_ `<any>` value to group by
- `thisArg`: `<any>` value to be used as `this` when calling `classifier`
- _Returns:_ [`<Map>`][map] map with arrays of iterator values grouped by keys
  returned by `classifier`

Consumes an iterator grouping values by keys

#### Iterator.prototype.includes(element)

#### Iterator.prototype.join(sep = ', ', prefix = '', suffix = '')

#### Iterator.prototype.last(\[defaultValue\])

- `defaultValue`: `<any>` value to be used if iterator is empty

_Returns:_ `<any>`|[`<undefined>`][undefined] last value of this iterator or
[`<undefined>`][undefined]

Consumes an iterator returning last iterator value

#### Iterator.prototype.map(mapper, thisArg)

#### Iterator.prototype.max(\[accessor\[, thisArg\]\])

- `accessor`: [`<Function>`][function] gets value to compare by, current
  iterator value is used by default
  - `value`: `<any>` current iterator value
  - _Returns:_ `<any>` value to compare by
- `thisArg`: `<any>` value to be used as `this` when calling `accessor`

_Returns:_ element with maximum value or [`<undefined>`][undefined] if iterator
is empty

Find the maximum value in this iterator

#### Iterator.prototype.min(\[accessor\[, thisArg\]\])

- `accessor`: [`<Function>`][function] gets value to compare by, current
  iterator value is used by default
  - `value`: `<any>` current iterator value
  - _Returns:_ `<any>` value to compare by
- `thisArg`: `<any>` value to be used as `this` when calling `accessor`

_Returns:_ element with minimum value or [`<undefined>`][undefined] if iterator
is empty

Find the minimum value in this iterator

#### Iterator.prototype.next()

#### Iterator.prototype.partition(predicate\[, thisArg\])

- `predicate`: [`<Function>`][function] function returns a value to partition
  this iterator
  - `value`: `<any>` current iterator element
  - _Returns:_ [`<boolean>`][boolean]|[`<number>`][number] key denoting
    resulting partition this value will be assigned to. Number denotes index in
    the resulting array. Boolean will be cast to number
- `thisArg`: `<any>` value to be used as `this` when calling `predicate`
- _Returns:_ [`<Array>`][array] array of partitions (arrays), will always have
  at least 2 arrays in it

Consumes an iterator, partitioning it into Arrays

#### Iterator.prototype.reduce(reducer, initialValue)

#### Iterator.prototype.skip(amount)

#### Iterator.prototype.skipWhile(predicate, thisArg)

#### Iterator.prototype.some(predicate, thisArg)

#### Iterator.prototype.someCount(predicate, count, thisArg)

#### Iterator.prototype.take(amount)

#### Iterator.prototype.takeWhile(predicate, thisArg)

#### Iterator.prototype.toArray()

#### Iterator.prototype.toObject()

Transforms an iterator of key-value pairs into an object.

This is similar to what [`Object.fromEntries()`][object.fromentries()] would
offer.

#### Iterator.prototype.zip(...iterators)

### iter(base)

### iterEntries(obj)

### iterKeys(obj)

### iterValues(obj)

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

#### Pool.prototype.get()

#### Pool.prototype.put(value)

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

### class MemoryWritable extends [Writable][writable]

#### MemoryWritable.prototype.constructor(\[sizeLimit\])

- `sizeLimit`: [`<number>`][number]|[`<string>`][string] limit of the internal
  buffer size specified as number in bytes or as string in format supported by
  `common.bytesToSize()`. Defaults to 8 MB

#### async MemoryWritable.prototype.getData(\[encoding\])

- `encoding`: [`<string>`][string] encoding to convert the resulting data to,
  must be a valid [`<Buffer>`][buffer] encoding

_Returns:_ [`<Promise>`][promise]

Return a Promise that will be resolved with all the written data once it

becomes available.

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

#### Uint64.and(a, b)

#### Uint64.cmp(a, b)

#### Uint64.div(a, b)

#### Uint64.mod(a, b)

#### Uint64.mult(a, b)

#### Uint64.not(a)

#### Uint64.or(a, b)

#### Uint64.shiftLeft(a, b)

#### Uint64.shiftRight(a, b)

#### Uint64.sub(a, b)

#### Uint64.xor(a, b)

#### Uint64.prototype.constructor(value)

#### Uint64.prototype.add(b)

#### Uint64.prototype.and(b)

#### Uint64.prototype.dec()

#### Uint64.prototype.inc()

#### Uint64.prototype.not()

#### Uint64.prototype.or(b)

#### Uint64.prototype.shiftLeft(b)

#### Uint64.prototype.shiftRight(b)

#### Uint64.prototype.sub(b)

#### Uint64.prototype.toJSON()

#### Uint64.prototype.toPostgres()

#### Uint64.prototype.toString(radix = 10)

#### Uint64.prototype.toUint32()

#### Uint64.prototype.xor(b)

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

### safe(fn)

- `fn`: [`<Function>`][function]

_Returns:_ [`<Function>`][function] function(...args), wrapped with try/catch
interception

- `args`: [`<Array>`][array] arguments to be passed to wrapped function

Make function raise-safe

### captureMaxStack()

### callerFilename(depth = 0, stack = null)

### callerFilepath(depth = 0, stack = null)

- `depth`: [`<number>`][number]|[`<RegExp>`][regexp] initial stack slice or
  filter regular expression, 0 by default.
- `stack`: [`<string>`][string] stack string, optional

Try to detect the filepath of a caller of this function.

## Contributors

See github for full [contributors list](https://github.com/metarhia/common/graphs/contributors)

[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[date]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[regexp]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[map]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[error]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
[typeerror]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type
[null]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type
[undefined]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[object.fromentries()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries
[buffer]: https://nodejs.org/api/buffer.html#buffer_class_buffer
[eventemitter]: https://nodejs.org/api/events.html#events_class_eventemitter
[writable]: https://nodejs.org/api/stream.html#stream_class_stream_writable
