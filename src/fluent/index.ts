import { ObjectsMap, arrayFrom, arrayPull, objectPull } from '@/helpers/index';
import type { Obj } from '@/helpers/index';

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
export function map<T>(items: string[], getKey?: ((item: string) => T)): Record<string, T>;
export function map<T extends object>(items: Iterable<T>, getKey?: ((item: T) => string)): ObjectsMap<T>;
export function map<T extends object, S extends keyof T>(items: Iterable<T>, key: S): ObjectsMap<T>;
export function map<T extends object, S extends keyof T>(value: Iterable<T> = [], key?: S | ((item: T) => string)): ObjectsMap<T> {
    if (!Array.isArray(value) || typeof value[0] !== 'string')
        return ObjectsMap.createFromArray(value, key as S);

    const mapItem = key as unknown as ((item: string) => T);

    return value.reduce((recordMap, item) => {
        recordMap[item] = mapItem(item);

        return recordMap;
    }, {} as Record<string, unknown>);
}
/* eslint-enable max-len */

export function pull<T>(items: T[], index: number): T;
export function pull<T extends Obj, K extends keyof T>(obj: T, key: K): T[K];
export function pull(obj: unknown, key: unknown): unknown {
    return Array.isArray(obj)
        ? arrayPull(obj, key as number)
        : objectPull(obj as Obj, key as keyof Obj);
}

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
