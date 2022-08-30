# Changelog

## [Unreleased][unreleased]

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

[unreleased]: https://github.com/metarhia/metautil/compare/v3.5.24....HEAD
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
