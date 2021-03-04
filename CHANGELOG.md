# Changelog

## [Unreleased][unreleased]

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

[unreleased]: https://github.com/metarhia/metautil/compare/v3.5.1...HEAD
[3.5.1]: https://github.com/metarhia/metautil/compare/v3.5.0...v3.5.1
[3.5.0]: https://github.com/metarhia/metautil/compare/v3.4.0...v3.5.0
[3.4.0]: https://github.com/metarhia/metautil/compare/v3.3.0...v3.4.0
[3.3.0]: https://github.com/metarhia/metautil/compare/v3.2.0...v3.3.0
[3.2.0]: https://github.com/metarhia/metautil/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/metarhia/metautil/compare/v3.0.1...v3.1.0
[3.0.1]: https://github.com/metarhia/metautil/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/metarhia/metautil/compare/v2.2.0...v3.0.0
[2.2.0]: https://github.com/metarhia/common/releases/tag/v2.2.0
