# fast-fnv1a

A fast 32-bit [FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function) hash implementation for JavaScript, **up to 6x faster than alternatives**. [The same implementation is adopted by `fastify-etag` and see 2x performance boost with large responses](https://github.com/fastify/fastify-etag/pull/152).

The implementation is based on prior work by [@tjwebb](https://github.com/tjwebb) (Travis Webb) and [@desudesutalk](https://github.com/desudesutalk) under the MIT license, with extra simplifacations and optimizations (like inline lookup table and faster hex conversion).

The classic 32-bit FNV-1a is usually written with a chain of shifts and adds to emulate the 32-bit multiply. That forces the value out of the small-integer range on every character, so the engine keeps boxing it as a double. This implementation instead carries the hash as two 16-bit halves, which stay inside the small-integer range throughout — making it **up to 6x faster**.

> If you need a larger hash space, check out [fnv1a52](https://github.com/SukkaW/fnv1a52) for 52 bits (still a plain `number`, w/o `BigInt`), or [@danielroe](https://github.com/danielroe)'s [fnv1a-64](https://github.com/danielroe/fnv1a-64) for full 64 bits hash space.

## Install

```sh
pnpm add fast-fnv1a
yarn add fast-fnv1a
npm install fast-fnv1a
```

## Usage

```js
import { fnv1a, fnv1ahex } from 'fast-fnv1a';

console.log(fnv1a('hello world'));
//=> 3582672807

console.log(fnv1ahex('hello world'));
//=> 'd58b3fa7'
```

> You should NEVER `fnv1a().toString(16)`! `fnv1ahex` can get you a fixed length zero-padded hex string **up to 3.9x faster** via a byte-to-hex lookup table.

## API

### `fnv1a(str)`

Returns the 32-bit FNV-1a hash of `str` as an unsigned `number`.

- **str**: `string`

### `fnv1ahex(str)`

Returns the 32-bit FNV-1a hash of `str` as a lowercase hexadecimal `string` (fixed length, zero-padded to 8 characters).

- **str**: `string`

Prefer this over `fnv1a(str).toString(16)` — it uses a byte-to-hex lookup table and is up to 3.9x faster.

Note the fixed length means this is **not** always equal to `fnv1a(str).toString(16)`: a hash below `16 ** 7` keeps its leading zero here, while `toString(16)` drops it.

## Benchmark

Hashing `'the quick brown fox jumps over the lazy dog'`, compared against [`fnv1a`](https://www.npmjs.com/package/fnv1a) and [`@sindresorhus/fnv1a`](https://www.npmjs.com/package/@sindresorhus/fnv1a):

```
$ pnpm run bench

clk: ~3.27 GHz
cpu: Apple M2 Max
runtime: node 24.18.0 (arm64-darwin)

• fnv1a
------------------------------------------------- -------------------------------
fnv1a                              298.12 ns/iter
@sindresorhus/fnv1a                  1.14 µs/iter
fast-fnv1a                          69.17 ns/iter

• hex
------------------------------------------------- -------------------------------
fnv1a + toString(16)               627.36 ns/iter
@sindresorhus/fnv1a + toString(16)   1.10 µs/iter
fast-fnv1a + toString(16)          356.68 ns/iter
fnv1ahex                            92.01 ns/iter
```

Note that `@sindresorhus/fnv1a` hashes UTF-8 bytes and returns a `BigInt`, so it is not a drop-in equivalent — it produces different values for non-BMP input and costs an allocation per call. `fnv1a` and `fast-fnv1a` both hash UTF-16 code units and agree on all inputs.

## License

[MIT](LICENSE)

----

**fast-fnv1a** © [Sukka](https://github.com/SukkaW), Released under the [MIT](./LICENSE) License.
Authored and maintained by Sukka with help from contributors ([list](https://github.com/SukkaW/fast-fnv1a/graphs/contributors)).

> [Personal Website](https://skk.moe) · [Blog](https://blog.skk.moe) · GitHub [@SukkaW](https://github.com/SukkaW) · Telegram Channel [@SukkaChannel](https://t.me/SukkaChannel) · Mastodon [@sukka@acg.mn](https://acg.mn/@sukka) · Twitter [@isukkaw](https://twitter.com/isukkaw) · BlueSky [@skk.moe](https://bsky.app/profile/skk.moe)

<p align="center">
  <a href="https://github.com/sponsors/SukkaW/">
    <img src="https://sponsor.cdn.skk.moe/sponsors.svg"/>
  </a>
</p>
