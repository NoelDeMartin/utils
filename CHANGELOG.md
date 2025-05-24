# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.7.1](https://github.com/NoelDeMartin/utils/releases/tag/v0.7.1) - 2025-05-24

### Added

- New helpers: `objectDeepValue`, `overridePrototypeMethod`, and `weakMemo`.

### Changed

- `arraySorted` helper now accepts deep keys (separated by dots, eg. `arraySorted(users, 'socials.mastodon')`).
- `after` helper now accepts ms (previously it required an object indicating the units).

### Fixed

- `urlFileName` helper (it wasn't removing fragments from path).

## [v0.7.0](https://github.com/NoelDeMartin/utils/releases/tag/v0.7.0) - 2025-03-31

### Changed

- Modernized tooling, the library is now ESM-only and has been tested with Node 22+.

## [v0.6.0](https://github.com/NoelDeMartin/utils/releases/tag/v0.6.0) - 2025-01-05

### Added

- New helpers: `arrayFind`, `arrayGroupBy`, `clamp`, `FakeServer`, `memo`, `required`, `resetAsyncMemo`, `SubPartial`, and `Writable`.

### Changed

- Refactored Facades to take constructor instead of instance.
- Location helpers now return a promise that will be resolved when the location has been updated.

### Deprecated

- `*Empty` types, use `NonNullable` or `null | undefined` instead.

### Fixed

- `Sempahore` usage in synchronous threads.

## [v0.5.1](https://github.com/NoelDeMartin/utils/releases/tag/v0.5.1) - 2023-12-17

### Added

- New helpers: `forever` and `formatCodeBlock`.

## [v0.5.0](https://github.com/NoelDeMartin/utils/releases/tag/v0.5.0) - 2023-11-24

### Added

- Setting testing namespace, in order to support alternative testing runtimes like [Vitest](https://vitest.dev/).
- New helpers: `asyncFirst`, `asyncMemo`, `monkeyPatch`, `OnlyKnownProperties`, and `stringToTitleCase`.

### Changed

- Refactored `MagicObject` and Facades.

### Fixed

- Sorting `undefined` and `null` fields in `arraySorted`.
- `tap` helper type inference.

## [v0.4.0](https://github.com/NoelDeMartin/utils/releases/tag/v0.4.0) - 2023-03-10

Changes weren't documented for previous versions, sorry 🙈.
