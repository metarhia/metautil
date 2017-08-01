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

## Splits array into two parts
`common.splitAt(index, array)`
- `index` - index defining end of first part and start of second
- `array` - Array which is splitting
- Returns: tuple with two parts of the array

## Check is value scalar
`common.isScalar(value)`
- `value` - scalar value or Object
- Returns: Boolean

## Copy dataset (copy objects to new Array)
`common.copy(ds)`
- `ds` - Array of objects (source dataset)
- Returns: Array of objects

## Clone Object
`common.clone(obj)`
- `obj` - Object or Array
- Returns: Object or Array

## Duplicate Object ot Array
`common.duplucate(obj)`
- `obj` - Object or Array
- Returns: Object or Array

## Read property by dot-separated path
`common.getByPath(data, dataPath)`
- `data` - Object
- `dataPath` - String (dot-separated path)
- Returns: value

## Set property by dot-separated path
`common.setByPath(data, dataPath, value)`
- `data` - Object
- `dataPath` - String (dot-separated path)
- `value` - new value

## Delete property by dot-separated path
`common.deleteByPath(data, dataPath)`
- `data` - Object
- `dataPath` - String (dot-separated path)
- Returns: Boolean

## Distinct merge miltiple arrays
`common.merge(array1, ..., arrayN)`
- `...args` - arrays
- Returns: Array

## Substitute variables
`common.subst(tpl, data, dataPath, escapeHtml)`
- `tpl` - template body
- `data` - global data structure to visualize
- `dataPath` - current position in data structure
- `escapeHtml` - escape html special characters if true
- Returns: String

## Escape html characters
`common.htmlEscape(content)`
- `content` - String to escape
- Returns: String
- Example: htmlEscape('5>=5') : '5&lt;=5'

## Extract file extension in lower case with no dot
`common.fileExt(fileName)`
- `fileName` - String, file name
- Returns: String
- Example: fileExt('/dir/file.txt')
- Result: 'txt'

## Remove file extension from file name
`common.removeExt(fileName)`
- `fileName` - String, file name
- Returns: String
- Example: fileExt('file.txt')
- Result: 'file'

## Convert spinal case to camel case
`common.spinalToCamel(name)`
- `name` - String
- Returns: String

## Escape regular expression control characters
`common.escapeRegExp(s)`
- `s` - String
- Returns: String
- Example: escapeRegExp('/path/to/res?search=this.that')

## Generate escaped regular expression
`common.newEscapedRegExp(s)`
- `s` - String
- Returns: instance of RegExp

## Add trailing slash at the end if it has no
`common.addTrailingSlash(s)`
- `s` - string
- Returns: string

## Remove trailing slash from string
`common.stripTrailingSlash(s)`
- `s` - string
- Returns: string

## Get directory name with trailing slash from path
`common.dirname(filePath)`
- `filePath` - String
- Returns: String

## Capitalize string
`common.capitalize(s)`
- `s` - String

## Extract substring between prefix and suffix
`common.between(s, prefix, suffix)`
- `s` - source string
- `prefix` - substring before needed fragment
- `suffix` - substring after needed fragment
- Returns: String

## Remove UTF-8 BOM
`common.removeBOM(s)`
- `s` - string possibly starts with BOM
- Returns: string

## Generate RegExp from array with '*' wildcards
`common.arrayRegExp(items)`
- `items` - array of strings
- Returns: RegExp instance
- Example: ['/css/*', '/index.html']

## Compare time1 and time2
`common.isTimeEqual(time1, time2)`
- `time1` - time string or milliseconds
- `time2` - time string or milliseconds
- Returns: Boolean
- Example: isTimeEqual(sinceTime, buffer.stats.mtime);

## Current date in YYYY-MM-DD format
`common.nowDate(now)`
- `now` - date Object (optional)
- Returns: String

## Current date in YYYY-MM-DD  hh:mm format
`common.nowDateTime`
- `now` - date Object (optional)
- Returns: String

## Function for mapping object fields
`common.omap(mapFn, obj)`
- `mapFn` - funtions applied to every field value
- `obj` - object which fields used for mapping
- Returns: object with same reference but with transformed fields

## Compose multiple functions into one
`common.compose(fn1, ..., fnN)`
- `...fns` - functions
- Returns: composed function

## Apply given function to value or default value
`common.maybe(fn, defVal, value)`
- `fn` - function
- `defVal` - default value
- `value` - value (optional)
- Returns: result of `fn` or `defVal`

## Zipping several arrays into one
`common.zip(arrays)`
- `...arrays` - input arrays
- Returns: array length is minimal of input arrays length
- Element with index i of resulting array is array with
- elements with index i from input arrays

## Create array of replicated value
`common.replicate(count, elem)`
- `count` - new array length
- `elem` - value to replicate
- Returns: replicated array

## Zipping arrays using specific function
`common.zipWith(fn, arr1, ..., arrN)`
- `fn` - function for zipping elements with index i
- `...arrays` - input arrays
- Element with index i of resulting array is result
- of fn called with arguments from arrays
- Returns: Array

## Curries function until the condition
`common.curryUntil(condition, argsI, argsParts, fn, ...args)`
- `condition` - function(argsI, argsParts) returns boolean
- argsI is arguments for i-th currying
- argsParts is array of args given for currying from first to i-th currying
- `fn` - function which will be curried
- `...args` - arguments for fn
- Returns: curried function

## Curry fn count times
`common.curryN(fn, count, ...args)`
- First curry uses args as arguments for first currying
- `fn` - curried function
- `count` - number of times function should be curried
- `...args` - arguments for first currying
- Returns: function curried given times count

## Curry function curry with fn
`common.curryTwice(fn)(args)`
- `fn` - function to be curried
- Returns: function to pass arguments that returns curried fn

## Curry function with given arguments
`common.curry(fn, ...args)`
- `fn` - function
- `...args` - arguments
- Returns: curried function

## Apply arguments
`common.applyArgs(...args)(fn)`
- `...args` - arguments to save in closure
- Returns: function to pass (fn) arguments will be applied

## Get first not errored result of fn
`common.either(fn)`
- `fn` - function to be called
- Returns: result of `fn`

## Empy function
`common.falseness()`
- Returns: Boolean always false

## Empy function
`common.trueness()`
- Returns: Boolean always true

## Empy function
`common.emptiness()`
- Returns: always undefined

## Empy asynchronous callback-last single-argument function
`common.nop(callback)`
- `callback` - callback to be called with (null)

## Empy asynchronous callback-last double-argument function
`common.noop(empty, callback)`
- `empty` - incoming value to be ignored
- `callback` - callback to be called with (null, null)

## Wrap callback: call once, not null
`common.cb(callback)`
- `callback` - function (optional)
- Returns: wrapped callback

## Exctracts callback and wraps it with common.cb
`common.cbExtract(...args)`
- callback is last argument if it's function
- otherwise it's `common.falseness`
- `args` - arguments
- Returns: wrapped callback

## Override method: save old to `fn.inherited`
`common.override(obj, fn)`
- `obj` - Object containing method to override
- `fn` - function, name will be used to find method
- Previous function will be accessible by obj.fnName.inherited

## Generate int array from given range
`common.range(from ,to)`
- `from` - range start
- `to` - range end
- Returns: array
- Example: range(1, 5) = [1, 2, 3, 4, 5]

## Generate int array from sequence syntax
`common.sequence(seq, max)`
- `seq` - Array
- `max` - optional max
- Returns: Array
- Examples:
- list: sequence([81, 82, 83]) = [81, 82, 83]
- range from..to: sequence([81,,83]) = [81, 82, 83]
- range from..count: sequence([81, [3]]) = [81, 82, 83]
- range from..max-to: sequence([81, [-2]], 5) = [81, 82, 83]

## Generate random int in given range
`common.random(min, max)`
- `min` - range start
- `max` - range end
- Returns: Number

## Shuffle an array
`common.shuffle(arr)`
- `arr` - array
- Returns: array

## EventEmitter with wildcard
`common.eventEmitter()`
- Returns: EventEmitter instance

## Rest left, transfor function
`common.restLeft(fn)`
- `fn` - (args, arg1..argN, callback) to (arg1..argN, ...args, callback)
- Returns: function to pass arguments for `fn`

## Parse duration to seconds
`common.duration(s)`
- `s` - string in duration syntax
- Returns: Number milliseconds
- Example: duration('1d 10h 7m 13s')

## Convert int to string size Kb, Mb, Gb and Tb
`common.bytesToSize(bytes)`
- `bytes` - int size
- Returns: String

## Convert string with units to int
`common.sizeToBytes(size)`
- `size` - string size
- Returns: Number

## Pack IP string to single int
`common.ip2int(ip)`
- ip = '127.0.0.1'
- Returns: Number

## Get local network interfaces
`common.localIPs()`
- Returns: Array of strings

## Parse host string
`common.parseHost(host)`
- `host` - host or empty string, may contain `:port`
- Returns: host without port but not empty

## Divide a long big endian encoded unsigned integer by a small one
`common.longDivModBE(buffer, divisor)`
- (i.e., not longer than a machine word) in-place and return the remainder
- `buffer` - Buffer containing a divident
- `divisor` - a divisor as a Number
- Returns: Number (the remainder)

## Generate random key
`common.generateKey(length, passible)`
- `length` - key length
- `possible` - string with possible characters
- Returns: String key

## Generate an RFC4122-compliant GUID (UUID v4)
`common.generateGUID()`
- Returns: String GUID

## Generate random SID
`common.generateSID(config)`
- `config` - structure { length, characters, secret }
- Returns: SID

## Calculate SID CRC
`common.crcSID(config, key)`
- `config` - structure { length, characters, secret }
- `key` - SID (key)
- Returns: CRC

## Validate SID
`common.validateSID(config, sid)`
- `config` - structure { length, characters, secret }
- `sid` - session id string
- Returns: Boolean

## Calculate hash with salt
`common.hash(password, salt)`
- `password` - String
- `salt` - String
- Returns: String hash

## Validate hash
`common.validateHash(hash, password, salt)`
- `hash` - String
- `password` - String
- `salt` - String
- Returns: Boolean

## Compare for array.sort with priority
`common.sortComparePriority(priority, s1, s2)`
- `priority` - array of strings with priority
- `s1, s2` - comparing strings
- Returns: Number
- Example:
- comp = sortComparePriority(impress.CONFIG_FILES_PRIORITY);
- files.sort(comp);

## Compare for array.sort, directories first
`common.sortCompareDirectories(a, b)`
- `a, b` - comparing strings
- Returns: Number
- Example: files.sort(sortCompareDirectories);

## Compare for array.sort
`common.sortCompareByName(a, b)`
- `a, b` - objects `{ name }` to compare
- Returns: Number
- Example: files.sort(sortCompareByName);

## Extend Map interface total allocated size: map.allocated
`common.cache()`
- Returns: cache instance

## Splits string by the first occurrence of separator
`common.section`
- `s` - String
- `separator` - char or String
- Example: rsection('All you need is JavaScript', 'is')
- Returns: ['All you need ', ' JavaScript']

## Splits string by the last occurrence of separator
`commin.rsection`
- `s` - String
- `separator` - char or String
- Example: rsection('All you need is JavaScript', 'a')
- Returns: ['All you need is Jav', 'Script']

## Contributors

  - Timur Shemsedinov (marcusaurelius) <timur.shemsedinov@gmail.com>
  - Vlad Dziuba (DzyubSpirit) <dzyubavlad@gmail.com>
  - See github for full [contributors list](https://github.com/metarhia/common/graphs/contributors)
