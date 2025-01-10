# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
