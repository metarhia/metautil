# Metarhia Common Library

[![TravisCI](https://travis-ci.org/metarhia/common.svg?branch=master)](https://travis-ci.org/metarhia/common)
[![bitHound](https://www.bithound.io/github/metarhia/common/badges/score.svg)](https://www.bithound.io/github/metarhia/common)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/57f219ad89e64c848685a93f5f2f14c2)](https://www.codacy.com/app/metarhia/common)
[![NPM Version](https://badge.fury.io/js/metarhia-common.svg)](https://badge.fury.io/js/metarhia-common)
[![NPM Downloads/Month](https://img.shields.io/npm/dm/metarhia-common.svg)](https://www.npmjs.com/package/metarhia-common)
[![NPM Downloads](https://img.shields.io/npm/dt/metarhia-common.svg)](https://www.npmjs.com/package/metarhia-common)

Namespace: `api.common` in [Impress Application Server](https://github.com/metarhia/Impress)

## Installation

```bash
$ npm install metasync
```

### Splits array into two parts
`common.splitAt(index, array)`
- `index:number` - index defining end of first part and start of second
- `array:array` - to be splitted

Returns: tuple with two parts of the array

### Check is value scalar
`common.isScalar(value)`
- `value` - scalar value or Object

Returns: boolean

### Copy dataset (copy objects to new array)
`common.copy(ds)`
- `ds:array of objects` - source dataset

Returns: array of objects

### Clone Object
`common.clone(obj)`
- `obj:object or array`

Returns: object or array

### Duplicate object ot array
`common.duplucate(obj)`
- `obj:object or array`

Returns: object or array

### Read property by dot-separated path
`common.getByPath(data, dataPath)`
- `data:hash`
- `dataPath:string` - dot-separated path

Returns: value

### Set property by dot-separated path
`common.setByPath(data, dataPath, value)`
- `data:hash`
- `dataPath:string` - dot-separated path
- `value` - new value

### Delete property by dot-separated path
`common.deleteByPath(data, dataPath)`
- `data:object`
- `dataPath:string` - dot-separated path

Returns: boolean

### Distinct merge multiple arrays
`common.merge(...args)`
- `args:array of array`

Returns: array

### Substitute variables
`common.subst(tpl, data, dataPath, escapeHtml)`
- `tpl:string` - template body
- `data:hash` - data structure to visualize
- `dataPath:string` - current position in data structure
- `escapeHtml:boolean` - escape html special characters if true

Returns: string

### Escape html characters
`common.htmlEscape(content)`
- `content:string` - to escape

Returns: string

Example: `htmlEscape('5>=5') = '5&lt;=5'`

### Extract file extension in lower case with no dot
`common.fileExt(fileName, Result)`
- `fileName:string` - file name

Returns: string

Example: `fileExt('/dir/file.txt')`

Result: 'txt'

### Remove file extension from file name
`common.removeExt(fileName, Result)`
- `fileName:string` - file name

Returns: string

Example: `fileExt('file.txt')`

Result: 'file'

### Convert spinal case to camel case
`common.spinalToCamel(name)`
- `name:string`

Returns: string

### Escape regular expression control characters
`common.escapeRegExp(s)`
- `s:string`

Returns: string

Example:  escapeRegExp('/path/to/res?search=this.that')`

### Generate escaped regular expression
`common.newEscapedRegExp(s)`
- `s:string`

Returns: RegExp, instance

### Add trailing slash at the end if it has no
`common.addTrailingSlash(s)`
- `s:string`

Returns: string

### Remove trailing slash from string
`common.stripTrailingSlash(s)`
- `s:string`

Returns: string

### Get directory name with trailing slash from path
`common.dirname(filePath)`
- `filePath:string`

Returns: string

### Capitalize string
`common.capitalize(s)`
- `s:string`

### Extract substring between prefix and suffix
`common.between(s, prefix, suffix)`
- `s:string` - source
- `prefix:string` - before needed fragment
- `suffix:string` - after needed fragment

Returns: string

### Remove UTF-8 BOM
`common.removeBOM(s)`
- `s:string` - possibly starts with BOM

Returns: string

### Generate RegExp from array with '*' wildcards
`common.arrayRegExp(items)`
- `items:array of string`

Returns: RegExp, instance

Example: `['/css/*', '/index.html']`

### Compare time1 and time2
`common.isTimeEqual(time1, time2)`
- `time1:string` - time or milliseconds
- `time2:string` - time or milliseconds

Returns: boolean

Example: `isTimeEqual(sinceTime, buffer.stats.mtime);`

### Current date in YYYY-MM-DD format
`common.nowDate(now)`
- `now:Date` (optional)

Returns: string

### Current date in YYYY-MM-DD  hh:mm format
`common.nowDateTime(now)`
- `now:Date` (optional)

Returns: string

### Partial apply
`common.partial(fn, ...args)`
- `fn:function`
- `...args:array` - argumants

Returns: function

### Function for mapping object fields
`common.omap(mapFn, obj)`
- `mapFn:funtion` - to appy to every field value
- `obj:object` - which fields used for mapping

Returns: object, with same reference but with transformed fields

### Compose multiple functions into one
`common.compose(...fns)`
- `fns:array of function`

Returns: function, composed

### Apply given function to value or default value
`common.maybe(fn, defVal, value)`
- `fn:function`
- `defVal` - default value
- `value` (optional)

Returns: result of `fn` or `defVal`

### Zipping several arrays into one
`common.zip(...arrays)`
- `arrays` - array of array

Returns: array, length is minimal of input arrays length

Hint: Element with index i of resulting array is array with
elements with index i from input arrays

### Create array of replicated value
`common.replicate(count, elem)`
- `count:number` - new array length
- `elem` - value to replicate

Returns: array, replicated

### Zipping arrays using specific function
`common.zipWith(fn, ...arrays)`
- `fn:function` - for zipping elements with index i
- `arrays:array of array`

Returns: array

Hint: Element with index i of resulting array is result of fn called with arguments from arrays

### Curries function until the condition
`common.curryUntil(condition, fn, ...args)`
- `condition:function` - (argsI, argsParts) returns boolean
- `fn:function` - which will be curried
- `args:array` - arguments for fn

Returns: function, curried
### Curry fn count times, first curry uses args for first currying
`common.curryN(fn, count, ...args)`
- `fn:function` - curried
- `count:number` - of times function should be curried
- `args:array` - arguments for first currying

Returns: function, curried given times count

### Curry function curry with fn
`common.curryTwice(fn)`
- `fn:function` - to be curried

Returns: function, to pass arguments that returns curried fn

### Curry function with given arguments
`common.curry(fn, ...args)`
- `fn:function`
- `args:array` - arguments

Returns: function, curried

### Apply arguments
`common.applyArgs(...args)`
- `args:array` - arguments to save in closure

Returns: function, to pass (fn) arguments will be applied

### Get first not errored result of fn
`common.either(fn)`
- `fn:function` - to be called

Returns: result of `fn`

### Empy function
`common.falseness()`

Returns: boolean, always false

### Empy function
`common.trueness()`

Returns: boolean, always true

### Empy function
`common.emptiness()`

Returns: always undefined

### Empy asynchronous callback-last single-argument function
`common.nop(callback)`
- `callback:function` - callback to be called with (null)

### Empy asynchronous callback-last double-argument function
`common.noop(empty, callback)`
- `empty` - incoming value to be ignored
- `callback:function` - callback to be called with (null, null)

### Wrap function: call once, not null
`common.once(fn)`
- `fn:function (optional)`

Returns: function, wrapped callback

Hint: previous name: `common.cb` (deprecated)

### Extract callback function
It's unsafe: may return null, allow multiple calls
`common.unsafeCallback(args)`
- `args:array` - arguments

Returns: function, callback or null

Hint: previous name: `common.cbUnsafe` (deprecated)

Hint: another alias: `common.extractCallback` (deprecated)

### Exctracts callback and make it safe
Wrap collback with once and return common.emptiness if no callback
`common.safeCallback(args)`
- `args:array` - arguments

Returns: function, wrapped callback

Hint: previous name: `cbExtract` (deprecated)

### Exctracts callback and throw if no callback
`common.requiredCallback(args)`
- `args:array` - arguments

Returns: function

### Exctracts callback and make it safe
`common.onceCallback(args)`
Wrap collback with once()
and return common.emptiness if no callback
- `args:array` - arguments

Returns: function

### Override method: save old to `fn.inherited`
`common.override(obj, fn, Hint)`
- `obj:object` - containing method to override
- `fn:function` - name will be used to find method

Hint: Previous function will be accessible by obj.fnName.inherited

### Generate int array from given range
`common.range(from, to)`
- `from:naumber` - range start
- `to:naumber` - range end

Returns: array

Example: `range(1, 5) = [1, 2, 3, 4, 5]`

### Generate int array from sequence syntax
`common.sequence(seq, max, list, range from..to, range from..count, range from..max-to)`
- `seq:array`
- `max:number` - optional max

Returns: array

Example:
- list: sequence([81, 82, 83]) = [81, 82, 83]
- range from..to: sequence([81,,83]) = [81, 82, 83]
- range from..count: sequence([81, [3]]) = [81, 82, 83]
- range from..max-to: sequence([81, [-2]], 5) = [81, 82, 83]

### Last array element
`common.last(arr)`
- `arr:array`

Returns: element

### Make function raise-safe
`common.safe(fn)`
- `fn:function`

Returns: function, wrapped with try/catch interception

### Generate random int in given range
`common.random(min, max)`
- `min:number` - range start
- `max:number` - range end

Returns: number

### Shuffle an array
`common.shuffle(arr)`
- `arr:array`

Returns: array

### Enhanced EventEmitter with wildcard
`common.emitter()`

Returns: EventEmitter, instance

### Rest left, transfor function
`common.restLeft(fn)`
- `fn:function` - (args, arg1..argN, callback)

Returns: function, (arg1..argN, ...args, callback)

### Parse duration to seconds
`common.duration(s)`
- `s:string` - duration syntax

Returns: number, milliseconds

Example: `duration('1d 10h 7m 13s')`

### Convert int to string size Kb, Mb, Gb and Tb
`common.bytesToSize(bytes)`
- `bytes:number` - size

Returns: string

### Convert string with units to int
`common.sizeToBytes(size)`
- `size:string` - size

Returns: number

### Convert IP string to number
`common.ip2int(ip)`
- `ip:string` - IP address

Returns: number

### Get local network interfaces
`common.localIPs()`

Returns: srray of strings

### Parse host string
`common.parseHost(host)`
- `host:string` - host or empty string, may contain `:port`

Returns: string, host without port but not empty

### Divide a long big endian encoded unsigned integer by a small one
(i.e., not longer than a machine word) in-place and return the remainder
`common.longDivModBE(buffer, divisor)`
- `buffer:Buffer` - containing a divident
- `divisor:a divisor as a Number`

Returns: number, the remainder

### Generate random key
`common.generateKey(length, possible)`
- `length:number` - key length
- `possible:string` - with possible characters

Returns: string, key

### Generate an RFC4122-compliant GUID (UUID v4)
`common.generateGUID()`

Returns: string, GUID

### Generate random SID
`common.generateSID(config)`
- `config:record` - { length, characters, secret }

Returns: string, SID

### Calculate SID CRC
`common.crcSID(config, key)`
- `config:record` - { length, characters, secret }
- `key:string` - SID key

Returns: string, CRC

### Validate SID
`common.validateSID(config, sid)`
- `config:record` - { length, characters, secret }
- `sid:string` - session id

Returns: boolean

### Calculate hash with salt
`common.hash(password, salt)`
- `password:string`
- `salt:string`

Returns: string, hash

### Validate hash
`common.validateHash(hash, password, salt)`
- `hash:string`
- `password:string`
- `salt:string`

Returns: boolean

### Compare for array.sort with priority
`common.sortComparePriority(priority, s1, s2)`
- `priority:array of strings with priority`
- `s1, s2:string` - to compare

Returns: number

Example: `files.sort(common.sortComparePriority)`

### Compare for array.sort, directories first
`common.sortCompareDirectories(a, b)`
- `a, b:string` - to compare

Returns: number

Example: `files.sort(sortCompareDirectories);`

### Compare for array.sort
`common.sortCompareByName(a, b)`
- `a, b:object` - { name } to compare

Returns: number

Example: `files.sort(sortCompareByName)`

### Extend Map interface with:
`common.cache()`

Returns: object, cache instance
- `cache.allocated` - total allocated size
- `cache.add(key, val)` - add record
- `cache.del(key)` - delete record
- `cache.clr(prefix, fn)` - delete all if `key.startsWith(prefix)`

### Splits string by the first occurrence of separator
`common.section(s, separator)`
- `s:string`
- `separator:string` - or char

Returns: `['All you need ', ' JavaScript']`

Example: `rsection('All you need is JavaScript', 'is')`


### Splits string by the last occurrence of separator
`common.rsection(s, separator)`
- `s:string`
- `separator:string` - or char

Returns: `['All you need is Jav', 'Script']`

Example: `rsection('All you need is JavaScript', 'a')`

### Splits string by multiple occurrence of separator
`common.split(s, separator, limit)`
- `s:string`
- `separator:string (optional)` - default: ','
- `limit:number (optional)` - max length of result array

```js
Example: split('a,b,c,d')
Result: ['a', 'b', 'c', 'd']
```

```js
Example: split('a,b,c,d', ',', 2)
Result: ['a', 'b']
```

### Splits string by multiple occurrence of separator
`common.rsplit(s, separator, limit)`
- `s:string`
- `separator:string (optional)` - default: ','
- `limit:number (optional)` - max length of result array

```js
Example: split('a,b,c,d', ',', 2)
Result: ['c', 'd']
```

### Splits string by multiple occurrence of separator
`common.rsplit(s, separator, limit)`
- `s:string`
- `separator:string (optional)` - default: ','
- `limit:number (optional)` - max length of result array

```js
Example: split('a,b,c,d', ',', 2)
Result: ['c', 'd']
```

### Mixin for ES6 classes without overriding existing methods
`common.mixin(target, source)`
- `target` - mixin to target
- `source` - source methods

### Forward events from one EventEmitter to another
`common.forwardEvents(from, to, events)`
- `from:EventEmitter` - to listen for event
- `to:EventEmitter` - to emit event on
- `events:array of string` - event names

Example: `common.forwardEvent(from, to);`

Example: `common.forwardEvent(from, to, 'eventName');`

Example: `common.forwardEvent(from, to, { eventName: 'newEventName' });`

Example: `common.forwardEvent(from, to, ['eventName1', 'eventName2']);`

### List method names
`common.methods(iface)`
- `iface:object` - to be introspected

Returns: array of string, method names

### List property names
`common.properties(iface)`
- `iface:object` - to be introspected

Returns: array of string, property names

### Generate file storage key
`common.generateStorageKey()`

Returns: Array of string, [folder1, folder2, code]

## Contributors

  - Timur Shemsedinov (marcusaurelius) <timur.shemsedinov@gmail.com>
  - Vlad Dziuba (DzyubSpirit) <dzyubavlad@gmail.com>
  - See github for full [contributors list](https://github.com/metarhia/common/graphs/contributors)
