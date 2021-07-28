# Metarhia utilities

[![ci status](https://github.com/metarhia/metautil/workflows/Testing%20CI/badge.svg)](https://github.com/metarhia/metautil/actions?query=workflow%3A%22Testing+CI%22+branch%3Amaster)
[![snyk](https://snyk.io/test/github/metarhia/metautil/badge.svg)](https://snyk.io/test/github/metarhia/metautil)
[![npm version](https://badge.fury.io/js/metautil.svg)](https://badge.fury.io/js/metautil)
[![npm downloads/month](https://img.shields.io/npm/dm/metautil.svg)](https://www.npmjs.com/package/metautil)
[![npm downloads](https://img.shields.io/npm/dt/metautil.svg)](https://www.npmjs.com/package/metautil)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/metarhia/metautil/blob/master/LICENSE)

## Usage

- Install: `npm install metautil`
- Require: `const metautil = require('metautil');`

## Common utilities

- `random(min: number, max?: number): number`
- `sample(arr: Array<any>): any`
- `ipToInt(ip?: string): number`
- `parseHost(host?: string): string`
- `parseParams(params: string): object`
- `replace(str: string, substr: string, newstr: string): string`
- `split(s: string, separator: string): [string, string]`
- `fileExt(fileName: string): string`
- `between(s: string, prefix: string, suffix: string): string`
- `isFirstUpper(s: string): boolean`
- `toLowerCamel(s: string): string`
- `toUpperCamel(s: string): string`
- `isConstant(s: string): boolean`
- `nowDate(date?: Date): string`
- `duration(s: string | number): number`
- `bytesToSize(bytes: number): string`
- `sizeToBytes(size: string): number`
- `makePrivate(instance: object): object`
- `protect(allowMixins: Array<string>, ...namespaces: Array<object>): void`
- `parseCookies(cookie: string): object`
- `createAbortController(): AbortController`
- `timeout(msec: number, signal?: EventEmitter): Promise<void>`
- `delay(msec: number, signal?: EventEmitter): Promise<void>`

## Crypto utilities

- `cryptoRandom(): number`
- `generateKey(length: number, possible: string): string`
- `crcToken(secret: string, key: string): string`
- `generateToken(secret: string, characters: string, length: number): string`
- `validateToken(secret: string, token: string): boolean`
- `hashPassword(password: string): Promise<string>`
- `validatePassword(password: string, serHash: string): Promise<boolean>`

## Async abstractions

- `new Semaphore(concurrency: number, size?: number, timeout?: number)`

## License & Contributors

Copyright (c) 2017-2021 [Metarhia contributors](https://github.com/metarhia/metautil/graphs/contributors).
Metautil is [MIT licensed](./LICENSE).\
Metautil is a part of [Metarhia](https://github.com/metarhia) technology stack.
