# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased][unreleased]

### Added

- `Iterator.indices()` to simplify iterating over indices of an array.
- `Iterator.last()` to return last value of this iterator or provided
  `defaultValue`.
- `Iterator.firstNonNullable()` to find first non-nullable value or
  provided `defaultValue`.

### Fixed

- `common.shuffle()` having non-uniform distribution.

## [2.2.0][] - 2020-07-10

### Added

- A way to limit the internal buffer size of `MemoryWritable` stream.
- `common.mkdirpPromise()` function.
- `Iterator#apply()` and `Iterator#chainApply()` to improve iterator
  interaction with chained calls.
- `captureMaxStack()` utility to get maximum available stack trace.
- Table of contents to documentation.
- Get random element from array: `sample(array)`.
- ECMAScript Modules named exports support.
- `Iterator#min()`, `Iterator#max()`, and `Iterator#findCompare()` to
  simplify consumption of iterator in common use-cases
  (finding minimum, maximum, or using a custom condition appropriately).
- `Iterator#partition()` to allow splitting iterator values into
  multiple arrays.
- `Iterator.zip()` - static method for zipping iterators.
- `Iterator#groupBy()` to group iterator value into Map by
  specific keys.

### Changed

- `cryptoPrefetcher()` to throw when `bufSize` is not a multiple of
  `valueSize`.
- `MemoryWritable` internal buffer size is now limited to 8 MB by default.
- Signature of `callerFilepath()` to allow passing `RegExp` as depth to be used
  for filtering of stack frames.
- Return value of `cryptoPrefetcher()` now implements the Iterable interface.

### Fixed

- `common.subst()` behavior for @.value@ variables.
- `common.callerFilepath()` working incorrectly on paths with colon in them.

## [2.1.0][] - 2019-06-18

### Added

- `rmRecursive()` and `rmRecursivePromise()` functions.
- `Iterator#filterMap()` to enable more efficient filter+map. It will only
  return values from mapper function that do not match the passed
  filterValue (`undefined` by default).
- `Iterator#skipWhile()` to enable skipping elements while predicate holds.
- `MemoryWritable` stream implementation.

### Fixed

- Documentation by marking some methods as private and regenerating with a newer
  version of `@metarhia/doc`
  ([changelog](https://github.com/metarhia/metadoc/blob/master/CHANGELOG.md#056---2019-05-31)).

## [2.0.0][] - 2019-04-26

### Added

- This CHANGELOG.md file.
- `Iterator#collectWith()` now returns the provided object.
- `Iterator#toObject()` to collect iterable into an Object similar to
  [`Object.fromEntries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries).
- `common.iterEntries()`, `common.iterKeys()`, `common.iterValues()` utility
  methods.

### Changed

- Expose `AuthenticationStrength`'s `compliance` number property instead of
  `strength` string.
- Replaced ES5-style classes and inheritance with ES6 classes for `Cache` and
  `EnhancedEmitter`.
- Signature of `merger()` in `mergeObjects()` to also contain the merging key.

### Removed

- Dropped support for Node.js 6.
- Outdated `inherits()` method (in favor of `util.inherits()` available in
  Node.js).
- Multiple deprecated functions:
  - `common.ip2int()` - replace with `common.ipToInt()`
  - `common.cb()` - replace with `common.once()`
  - `common.extractCallback()` - replace with `common.unsafeCallback()`
  - `common.cbUnsafe()` - replace with `common.unsafeCallback()`
  - `common.cbExtract()` - replace with `common.safeCallback()`
  - `common.crcSID()` - replace with `common.crcToken()`
  - `common.generateSID()` - replace with `common.generateToken()`
  - `common.validateSID()` - replace with `common.validateToken()`
- Functions that can be replaced with `util.deprecate()` available in Node.js:
  - `common.deprecate()`
  - `common.alias()`

### Fixed

- Functions `common.clone()`, `common.deleteByPath()`, and
  `common.mergeObjects()` throwing when used on objects without prototype.

## [1.5.0][] - 2019-04-12

### Added

- `Symbol.toStringTag` property to `Iterator`.
- All of the missing methods' documentation.

## [1.4.2][] - 2019-03-28

### Fixed

- Issue with circular dependency on `metasync` package.

## [1.4.1][] - 2019-03-27

### Fixed

- Unsuccessful attempt at fixing an issue with circular dependency on
  `metasync` package.

## [1.4.0][] - 2019-03-27

### Added

- Password authentication test functions accounting for password topologies and
  popular passwords.
- Recursive `rmdir` implementation `rmdirp()`.

### Fixed

- `Iterator#includes()` working incorrectly for non-number values.

## [1.3.1][] - 2019-03-26

### Fixed

- Browser build.

## [1.3.0][] - 2019-03-22

### Added

- Recursive `mkdir` implementation `mkdirp()`.
- Implementation of `pushSame()` for arrays.
- Simple `Pool` implementation.

### Fixed

- `duplicate()` throwing when used with objects that have no prototype.
- Deprecation warnings when using `duplicate()` on `Buffer`s.

## [1.2.1][] - 2018-12-11

### Fixed

- Iterating over inherited properties in `mergeObjects()`.
- `duplicate()` and `clone()` regression.

## [1.2.0][] - 2018-12-07

### Added

- `Iterator.range()` method.
- `crcToken()`, `generateToken()`, and `validateToken()` functions.

### Deprecated

- `crcSID()` function in favor of `crcToken()`.
- `generateSID()` function in favor of `generateToken()`.
- `validateSID()` function in favor of `validateToken()`.

### Fixed

- Argument name collision in `validateHash()`.

## [1.1.1][] - 2018-11-23

### Fixed

- `Int64` Postgres serialization.

## [1.1.0][] - 2018-11-23

### Added

- JSON and Postgres serialization to Uint64 and Int64 via methods `toJSON()`
  and `toPostgres()`.
- Ability to construct `Uint64` from `Int64`.

## [1.0.0][] - 2018-11-21

### Added

- The first stable version of the `@metarhia/common` package.

[unreleased]: https://github.com/metarhia/common/compare/v2.2.0...HEAD
[2.2.0]: https://github.com/metarhia/common/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/metarhia/common/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/metarhia/common/compare/v1.5.0...v2.0.0
[1.5.0]: https://github.com/metarhia/common/compare/v1.4.2...v1.5.0
[1.4.2]: https://github.com/metarhia/common/compare/v1.4.1...v1.4.2
[1.4.1]: https://github.com/metarhia/common/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/metarhia/common/compare/v1.3.1...v1.4.0
[1.3.1]: https://github.com/metarhia/common/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/metarhia/common/compare/v1.2.1...v1.3.0
[1.2.1]: https://github.com/metarhia/common/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/metarhia/common/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/metarhia/common/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/metarhia/common/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/metarhia/common/releases/tag/v1.0.0
