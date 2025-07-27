# Changelog

## [Unreleased][unreleased]

- Added `fileExists` and `exists`

## [5.2.5][] - 2025-05-21

- Add node.js 24 to CI
- Update dependencies

## [5.2.4][] - 2024-09-12

- Update eslint/prettier/metarhia configs

## [5.2.3][] - 2024-08-30

- Update eslint to 9.x and prettier with configs
- Add node.js 22 to CI
- Add await for res.json()

## [5.2.2][] - 2024-04-26

- Fix Content-length on httpApiCall
- Fix memory-leak on fetch
- Validate collected data
- Update dependencies

## [5.2.1][] - 2024-02-10

- Fixed abort handling in `Collector`
- Fixed `Pool`: release captured items to queue
- Update dependencies

## [5.2.0][] - 2023-12-20

- Added `defaults` to `Collector` options
- Collector: fix signel getter
- Collector: use `Signal.timeout` instead of `setTimeout`
- Collector: add `.signal: AbortSignal` and `abort()`

## [5.1.0][] - 2023-12-17

- Support waiting for promise in `Collector.wait`
- Add `reassign: boolean` to `Collector` options

## [5.0.0][] - 2023-12-10

- Changed `Semaphore` signature, moved all parameters to `options`
- Changed `generateKey` parameter order
- Replaced `node:http/https` with node native `fetch` for `httpApiCall`
- Move `EventEmitter` polyfill from metacom (with improvements)
- Added customHeaders option for `httpApiCall`
- Implemented async collection: `Collector`
- Fixed sync capture in `Pool`

## [4.0.1][] - 2023-11-18

- Fix package: add `dist.js`
- Fix browser support: change `global` to `globalThis`
- Deprecate `fetch` polyfill

## [4.0.0][] - 2023-11-17

- Add browser support
- Change IPv4 representation in integer
- Implement `intToIp`
- Update dependencies and add node.js 21

## [3.15.0][] - 2023-10-21

- Add error.code ETIMEOUT for timeouts

## [3.14.0][] - 2023-10-09

- Implement titeoutify

## [3.13.0][] - 2023-10-06

- Use buf.subarray instead of buf.slice
- Drop node.js 16 and 19, update dependencies
- Convert lockfileVersion 2 to 3

## [3.12.0][] - 2023-08-26

- Add `projection` to copy subset of fields
- Improve `random` and `cryptoRandom` contracts to `(min?, max?)`
- Copy `shuffle` implementation from `metarhia/common`
- Pass `random` function as parameter to `shuffle` and `sample`

## [3.11.0][] - 2023-07-22

- New utilities: `serializeArguments`, `httpApiCall`, `trimLines`
- New fs utilities: `directoryExists`, `ensureDirectory`
- Added `toBool` for converting promises to boolean

## [3.10.0][] - 2023-06-30

- Implement DomainError
- Improve `Error` class, add `{ cause, code }`
- Fix error handling in fetch

## [3.9.1][] - 2023-06-18

- Actualize all .d.ts typings and update short docs in README.md
- Optimize `nextEvent`, `sizeToBytes` (support `10kb` and `10 kB`)
- More checks/validation and tests for crypto submodule
- Refactor `generateKey` using `Uint8Array` for speed
- Use constant-time algorithm to compare CRC for security

## [3.9.0][] - 2023-06-16

- Implement `parseRange` for HTTP headers
- Restructure submodules

## [3.8.0][] - 2023-06-08

- Moved from impress: `getSignature` and `Error`
- Regroup submodules, new `error.js` and `oop.js`
- Implement `getX509names(cert): Array<string>`

## [3.7.3][] - 2023-06-05

- Fix fileExt to support dotfiles
- Update dependencies

## [3.7.2][] - 2023-04-29

- Drop node.js 14 support, add node.js 20
- Convert package_lock.json to lockfileVersion 2
- Update dependencies

## [3.7.1][] - 2023-03-12

- Use native UUID from `node:crypto`
- Remove `defaultHash` (empty string) in crypto module
- Use `crypto.randomInt` for `generateKey`
- Fix `fetch` polyfill

## [3.7.0][] - 2023-03-04

- Add `generateUUID` implementation
- Improve `AbortController` polyfill and use native if available

## [3.6.0][] - 2022-12-19

- Use native `fetch` from node.js if available
- Fix `fetch` polyfill to be compatible with node.js `fetch` implementation
- Use `receiveBody` in `fetch` polyfill
- Optimize `fileExt`

## [3.5.25][] - 2022-08-30

- Optimize `parseCookies`
- Improve code style, apply optimizations, update dependencies

## [3.5.24][] - 2022-08-30

- Add `isError(instance): boolean`
- Support POST requests with body and custom headers in `fetch()`

## [3.5.23][] - 2022-08-12

- Add `flatObject(sourceObject: object, fieldNames: Array<string>): object`
- Add `unflatObject(sourceObject: object, fieldNames: Array<string>): object;`

## [3.5.22][] - 2022-07-29

- New functions: `parseDay` and `parseMonth`
- Fixed and `parseEvery` and `nextEvent`, more tests cases
- Add year support to `Every` format
- Add function `flatObject(sourceObject: object, fieldNames: Array<string>): object`
- Add function `isHashObject(o: string | number | boolean | object): boolean`

## [3.5.21][] - 2022-06-27

- Update dependencies, eslint, and optimize package

## [3.5.20][] - 2022-05-09

- Fix isFirstUpper bug with special characters
- Add isFirstLower and isFirstLetter functions

## [3.5.19][] - 2022-03-15

- Add nodejs 17 to CI
- Update dependencies

## [3.5.18][] - 2022-01-29

- Fix semaphore bug with counter and queue

## [3.5.17][] - 2022-01-26

- Add function `nowDateTimeUTC(date?: Date, timeSep?: string): string`
- Add case functions: `toLower`, `toCamel`, `spinalToCamel`, and `snakeToCamel`
- Fixed floating bug in tests for `nowDateTimeUTC`

## [3.5.16][] - 2021-10-10

- Add `Pool` method `isFree(item: object): boolean`
- Add function `jsonParse(buffer: Buffer): object | null`
- Add function `receiveBody(req: IncomingMessage): Promise<string | null>`

## [3.5.15][] - 2021-09-23

- Fixed Pool infinite loop case
- Add simple `fetch` API implementation

## [3.5.14][] - 2021-09-21

- Fix bugs in Pool and add tests for important cases

## [3.5.13][] - 2021-09-20

- Wait for available (released) item in Pool with waiting timeout
- Pool: prevent to add duplicates and to release not captured items
- Regrouped utilities into modules and tests

## [3.5.12][] - 2021-09-18

- Pool implementation with round-robian and exclusive item capture/release
- Move parsePath from impress

## [3.5.11][] - 2021-09-09

- Add `namespaceByPath(namespace: object, path: string): object | null`
- Add `md5(fileName: string): Promise<string>`

## [3.5.10][] - 2021-08-25

- Add and optimize `bytesToSize` and `sizeToBytes` from metarhia/common
- Update dependencies

## [3.5.9][] - 2021-07-27

- Optimize Semaphore
- Add Semaphore properties: `concurrency: number` add `empty: boolean`

## [3.5.8][] - 2021-07-22

- Return `-1` if past events detected by `nextEvent`

## [3.5.7][] - 2021-07-21

- Initial implementation of `parseEvery`
- Initial implementation of `nextEvent`

## [3.5.6][] - 2021-07-18

- Move types to package root
- Publish signatures in README.md

## [3.5.5][] - 2021-07-09

- Add split and parseParams
- Update dependencies

## [3.5.4][] - 2021-05-24

- Semaphore default parameters
- Package maintenance

## [3.5.3][] - 2021-05-05

- Implement 'toLowerCamel' and 'toUpperCamel'
- Package maintenance and update dependencies

## [3.5.2][] - 2021-04-20

- Semaphore bug: remove promise from queue on timeout
- Improve typings: use object as dictionary, import without require

## [3.5.1][] - 2021-03-04

- Add typings

## [3.5.0][] - 2021-02-22

- Implemented `await delay(msec, signal)`
- Fix timeout behaviour to reject promise (throw)
- Generate errors on timeout and on abort timeout

## [3.4.0][] - 2021-02-21

- Implement simple polyfill for AbortController
- Support AbortController in `await timeout`

## [3.3.0][] - 2021-02-19

- Change library file structure
- Move Semaphore from metacom with fixes
- Move timeout function from metacom

## [3.2.0][] - 2021-02-03

- Add parseCookies (moved from impress/auth)
- Add hashPassword, validatePassword (moved from impress/security)

## [3.1.0][] - 2021-01-22

- Added isFirstUpper to check is first char an upper case letter
- Added isConstant to check is string UPPER_SNAKE case
- Added makePrivate to emulate protected fields for objects
- Added protect to freeze interfaces except listed

## [3.0.1][] - 2021-01-18

- Optimize buffering crypto random generator

## [3.0.0][] - 2021-01-06

- Forked from https://github.com/metarhia/common after 2.2.0
- Removed everything except what we need in impress and its dependencies

## [2.2.0][] - 2020-07-10

See this link for 2.2.0 and all previous versions:
https://github.com/metarhia/common/blob/master/CHANGELOG.md

[unreleased]: https://github.com/metarhia/metautil/compare/v5.2.4....HEAD
[5.2.4]: https://github.com/metarhia/metautil/compare/v5.2.4...v5.2.4
[5.2.3]: https://github.com/metarhia/metautil/compare/v5.2.2...v5.2.3
[5.2.2]: https://github.com/metarhia/metautil/compare/v5.2.1...v5.2.2
[5.2.1]: https://github.com/metarhia/metautil/compare/v5.2.0...v5.2.1
[5.2.0]: https://github.com/metarhia/metautil/compare/v5.1.0...v5.2.0
[5.1.0]: https://github.com/metarhia/metautil/compare/v5.0.0...v5.1.0
[5.0.0]: https://github.com/metarhia/metautil/compare/v4.0.1...v5.0.0
[4.0.1]: https://github.com/metarhia/metautil/compare/v4.0.0...v4.0.1
[4.0.0]: https://github.com/metarhia/metautil/compare/v3.15.0...v4.0.0
[3.15.0]: https://github.com/metarhia/metautil/compare/v3.14.0...v3.15.0
[3.14.0]: https://github.com/metarhia/metautil/compare/v3.13.0...v3.14.0
[3.13.0]: https://github.com/metarhia/metautil/compare/v3.12.0...v3.13.0
[3.12.0]: https://github.com/metarhia/metautil/compare/v3.11.0...v3.12.0
[3.11.0]: https://github.com/metarhia/metautil/compare/v3.10.0...v3.11.0
[3.10.0]: https://github.com/metarhia/metautil/compare/v3.9.1...v3.10.0
[3.9.1]: https://github.com/metarhia/metautil/compare/v3.9.0...v3.9.1
[3.9.0]: https://github.com/metarhia/metautil/compare/v3.8.0...v3.9.0
[3.8.0]: https://github.com/metarhia/metautil/compare/v3.7.3...v3.8.0
[3.7.3]: https://github.com/metarhia/metautil/compare/v3.7.2...v3.7.3
[3.7.2]: https://github.com/metarhia/metautil/compare/v3.7.1...v3.7.2
[3.7.1]: https://github.com/metarhia/metautil/compare/v3.7.0...v3.7.1
[3.7.0]: https://github.com/metarhia/metautil/compare/v3.6.0...v3.7.0
[3.6.0]: https://github.com/metarhia/metautil/compare/v3.5.25...v3.6.0
[3.5.25]: https://github.com/metarhia/metautil/compare/v3.5.24...v3.5.25
[3.5.24]: https://github.com/metarhia/metautil/compare/v3.5.23...v3.5.24
[3.5.23]: https://github.com/metarhia/metautil/compare/v3.5.22...v3.5.23
[3.5.22]: https://github.com/metarhia/metautil/compare/v3.5.21...v3.5.22
[3.5.21]: https://github.com/metarhia/metautil/compare/v3.5.20...v3.5.21
[3.5.20]: https://github.com/metarhia/metautil/compare/v3.5.19...v3.5.20
[3.5.19]: https://github.com/metarhia/metautil/compare/v3.5.18...v3.5.19
[3.5.18]: https://github.com/metarhia/metautil/compare/v3.5.17...v3.5.18
[3.5.17]: https://github.com/metarhia/metautil/compare/v3.5.16...v3.5.17
[3.5.16]: https://github.com/metarhia/metautil/compare/v3.5.15...v3.5.16
[3.5.15]: https://github.com/metarhia/metautil/compare/v3.5.14...v3.5.15
[3.5.14]: https://github.com/metarhia/metautil/compare/v3.5.13...v3.5.14
[3.5.13]: https://github.com/metarhia/metautil/compare/v3.5.12...v3.5.13
[3.5.12]: https://github.com/metarhia/metautil/compare/v3.5.11...v3.5.12
[3.5.11]: https://github.com/metarhia/metautil/compare/v3.5.10...v3.5.11
[3.5.10]: https://github.com/metarhia/metautil/compare/v3.5.9...v3.5.10
[3.5.9]: https://github.com/metarhia/metautil/compare/v3.5.8...v3.5.9
[3.5.8]: https://github.com/metarhia/metautil/compare/v3.5.7...v3.5.8
[3.5.7]: https://github.com/metarhia/metautil/compare/v3.5.6...v3.5.7
[3.5.6]: https://github.com/metarhia/metautil/compare/v3.5.5...v3.5.6
[3.5.5]: https://github.com/metarhia/metautil/compare/v3.5.4...v3.5.5
[3.5.4]: https://github.com/metarhia/metautil/compare/v3.5.3...v3.5.4
[3.5.3]: https://github.com/metarhia/metautil/compare/v3.5.2...v3.5.3
[3.5.2]: https://github.com/metarhia/metautil/compare/v3.5.1...v3.5.2
[3.5.1]: https://github.com/metarhia/metautil/compare/v3.5.0...v3.5.1
[3.5.0]: https://github.com/metarhia/metautil/compare/v3.4.0...v3.5.0
[3.4.0]: https://github.com/metarhia/metautil/compare/v3.3.0...v3.4.0
[3.3.0]: https://github.com/metarhia/metautil/compare/v3.2.0...v3.3.0
[3.2.0]: https://github.com/metarhia/metautil/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/metarhia/metautil/compare/v3.0.1...v3.1.0
[3.0.1]: https://github.com/metarhia/metautil/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/metarhia/metautil/compare/v2.2.0...v3.0.0
[2.2.0]: https://github.com/metarhia/common/releases/tag/v2.2.0
