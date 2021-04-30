import { ObjectsMap, arrayFrom } from '@/helpers/index';

import FluentArray from './FluentArray';
import FluentString from './FluentString';
import type { FluentArrayInstance } from './FluentArray';
import type { FluentStringInstance } from './FluentString';

const fluentClasses = [FluentArray, FluentString];

export function str(value: string = ''): FluentStringInstance<FluentString> {
    return FluentString.create(value);
}

export function arr<T>(value: Iterable<T>): FluentArrayInstance<FluentArray<T>, T>;
export function arr<T>(value: T): FluentArrayInstance<FluentArray<T>, T>;
export function arr<T>(): FluentArrayInstance<FluentArray<T>, T>;
export function arr<T>(value: unknown = []): FluentArrayInstance<FluentArray<T>, T> {
    return FluentArray.create(arrayFrom(value) as T[]);
}

/* eslint-disable max-len */
export function map<T extends object>(items: Iterable<T>, getKey?: ((item: T) => string)): ObjectsMap<T>;
export function map<T extends object, S extends keyof T>(items: Iterable<T>, key: S): ObjectsMap<T>;
export function map<T extends object, S extends keyof T>(value: Iterable<T> = [], key?: S | ((item: T) => string)): ObjectsMap<T> {
    return ObjectsMap.createFromArray(value, key as S);
}
/* eslint-enable max-len */

export function fluent(value: string): FluentStringInstance<FluentString>;
export function fluent<T>(value: T[]): FluentArrayInstance<FluentArray<T>, T>;
export function fluent(value: unknown): unknown {
    const fluentClass = arr(fluentClasses).first(c => c.isPrimitive(value));

    return fluentClass ? (fluentClass as { create(v: unknown): unknown }).create(value) : null;
}

export { tap } from './tap';
export type { Tapped } from './tap';

export { default as FluentObjectDefinition } from './FluentObject';
export type { FluentHelperMethods, FluentInstance, FluentPrimitiveMethods, Helper, HelperParams } from './FluentObject';

export { default as FluentArrayDefinition } from './FluentArray';
export type { FluentArray, FluentArrayHelpers, FluentArrayInstance } from './FluentArray';

export { default as FluentStringDefinition, fluentStringHelpers } from './FluentString';
export type { FluentString, FluentStringInstance } from './FluentString';
