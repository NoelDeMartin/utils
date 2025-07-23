import type {
    Closure,
    ClosureArgs,
    Equals,
    GetClosureArgs,
    GetObjectMethods,
    KeyOf,
    Pretty,
    TypeGuard,
    VoidClosure,
} from '@noeldemartin/utils/types/helpers';
import type { Constructor } from '@noeldemartin/utils/types/classes';
import type { DeepKeyOf, DeepValue } from '@noeldemartin/utils/types';

export type Obj = Record<string, unknown>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GetObjectKeys<T> = T extends Record<infer Key, any> ? Key : keyof T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GetObjectValues<T> = T extends Record<any, infer Value> ? Value : never;

export type ValueWithout<TValue, TExclude> = TValue extends TExclude ? never : TValue;
export type ReplaceValues<TObj, TExclude> = { [K in keyof TObj]: ValueWithout<TObj[K], TExclude> };
export type GetRequiredKeysWithout<
    TObj,
    TExclude,
    U extends Record<keyof TObj, unknown> = ReplaceValues<TObj, TExclude>,
> = {
    [K in keyof TObj]: Record<string, never> extends Pick<TObj, K>
        ? never
        : U[K] extends never
          ? never
          : Equals<TObj[K], U[K]> extends true
            ? K
            : never;
}[keyof TObj];
export type GetOptionalKeysWithout<
    TObj,
    TExclude,
    U extends Record<keyof TObj, unknown> = ReplaceValues<TObj, TExclude>,
> = {
    [K in keyof TObj]: Record<string, never> extends Pick<TObj, K>
        ? K
        : U[K] extends never
          ? never
          : Equals<TObj[K], U[K]> extends true
            ? never
            : K;
}[keyof TObj];

// Given an existing bug in TypeScript, it's not possible to define optional keys using type generics without having
// them defined as `| undefined` as well. Until that is fixed, this may cause some problems for keys that can have
// empty values but not always do.
// See https://github.com/microsoft/TypeScript/issues/13195
export type ObjectWithout<TObj, TExclude> = Pretty<
    { [K in GetRequiredKeysWithout<TObj, TExclude>]: ValueWithout<TObj[K], TExclude> } & {
        [K in GetOptionalKeysWithout<TObj, TExclude>]?: ValueWithout<TObj[K], TExclude>;
    }
>;

export function deepEquals(a: unknown, b: unknown): boolean {
    if (a === b) return true;

    if (!isObject(a) || !isObject(b)) return false;

    if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();

    if (Object.keys(a).length !== Object.keys(b).length) return false;

    return !Object.keys(a).some((key) => !deepEquals(a[key], b[key]));
}

export function getClassMethods(target: object): string[] {
    const properties = new Set<string>();
    const classDefinition = target.constructor === Object.constructor ? target : target.constructor;

    let prototype = (classDefinition as { prototype: Constructor }).prototype;
    while (prototype.constructor !== Object) {
        Object.getOwnPropertyNames(prototype).forEach((property) => properties.add(property));

        prototype = Object.getPrototypeOf(prototype);
    }

    properties.delete('constructor');

    return Array.from(properties);
}

export function invert(map: Record<string, string>): Record<string, string> {
    return Object.entries(map).reduce(
        (invertedMap, [key, value]) => {
            invertedMap[value] = key;

            return invertedMap;
        },
        {} as Record<string, string>,
    );
}

export const isArray = Array.isArray.bind(Array);

export function isConstructor(value: object): value is Constructor {
    return 'prototype' in value;
}

export function isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) return true;

    if (Array.isArray(value) || typeof value === 'string') return value.length === 0;

    if (typeof value === 'object') return Object.keys(value as Record<string, unknown>).length === 0;

    return false;
}

export function isInstanceOf<T>(value: unknown, objectClass: Constructor<T>): value is T {
    return value instanceof objectClass;
}

export function isIterable(value: unknown): value is Iterable<unknown> {
    return typeof (value as { [Symbol.iterator]?: unknown })?.[Symbol.iterator] === 'function';
}

export function isObject(value: unknown): value is Obj {
    return typeof value === 'object' && value !== null;
}

export function isPlainObject(value: object): boolean {
    return Object.getPrototypeOf(value) === Object.prototype;
}

export function isString(value: unknown): value is string | String {
    return typeof value === 'string' || value instanceof String;
}

export function isNullable(value: unknown): value is undefined | null {
    return typeof value === 'undefined' || value === null;
}

export function monkeyPatch<T, K extends GetObjectMethods<T>>(object: T, method: K, callback: VoidClosure<T[K]>): void {
    const originalMethod = object[method] as unknown as Closure;

    object[method] = ((...args: ClosureArgs) => {
        (callback as unknown as Closure)(...args);

        return originalMethod.call(object, ...args);
    }) as unknown as T[K];
}

export function objectDeepClone<T extends Obj>(object: T): T {
    object = { ...object };

    for (const property in object) {
        if (!objectPropertyIsObject(object, property)) continue;

        object[property] = objectDeepClone(object[property]);
    }

    return object;
}

export function objectDeepValue<T extends object, K extends DeepKeyOf<T>>(object: T, key: K): DeepValue<T, K> {
    let value = object as object;
    const keys = key.split('.');

    for (const deepKey of keys) {
        if (!isObject(value)) {
            return undefined as DeepValue<T, K>;
        }

        value = value[deepKey] as object;
    }

    return value as DeepValue<T, K>;
}

export const objectEntries = Object.entries.bind(Object) as <T extends GetClosureArgs<typeof Object.entries>[0]>(
    obj: T
) => [GetObjectKeys<T>, GetObjectValues<T>][];

export function objectHasOwnProperty(object: Obj, property: string): boolean {
    return Object.prototype.hasOwnProperty.call(object, property);
}

export function objectMap<T>(items: T[], property: KeyOf<T, number | string>): Record<string, T> {
    return items.reduce(
        (map, item) => {
            map[item[property] as unknown as number | string] = item;

            return map;
        },
        {} as Record<string, T>,
    );
}

export function objectOnly<T extends object, K extends keyof T>(obj: T, keys: K | K[]): Pick<T, K> {
    const newObject: Pick<T, K> = {} as Pick<T, K>;
    const keysArray = Array.isArray(keys) ? keys : [keys];

    for (const key of keysArray) {
        if (!(key in obj)) continue;

        newObject[key] = obj[key];
    }

    return newObject;
}

export function objectPropertyIsObject<T extends string>(object: Obj, property: T): object is { [t in T]: Obj } {
    let value;

    return (
        objectHasOwnProperty(object, property) && isObject((value = object[property])) && value.constructor === Object
    );
}

export function objectPull<T extends Obj, K extends keyof T>(obj: T, key: K): T[K] {
    const value = obj[key];

    delete obj[key];

    return value;
}

/* eslint-disable max-len */
export function objectWithout<TObj extends Obj, TKey extends keyof TObj>(obj: TObj, key: TKey): Omit<TObj, TKey>;
export function objectWithout<TObj extends object, TKey extends keyof TObj>(obj: TObj, key: TKey): Omit<TObj, TKey>;
export function objectWithout<TObj extends Obj, TKey extends keyof TObj>(obj: TObj, keys: TKey[]): Omit<TObj, TKey>;
export function objectWithout<TObj extends object, TKey extends keyof TObj>(obj: TObj, keys: TKey[]): Omit<TObj, TKey>;
export function objectWithout<TObj extends Obj, TExclude>(
    obj: TObj,
    exclude: TypeGuard<TExclude>
): ObjectWithout<TObj, TExclude>;
export function objectWithout<TObj extends object, TExclude>(
    obj: TObj,
    exclude: TypeGuard<TExclude>
): ObjectWithout<TObj, TExclude>;
/* eslint-enable max-len */

export function objectWithout(obj: Obj, keysOrExclude: string | string[] | TypeGuard): unknown {
    if (typeof keysOrExclude === 'function') {
        const exclude = keysOrExclude;
        const cleanObject = {} as Record<string, unknown>;

        for (const [key, value] of Object.entries(obj)) {
            if (exclude(value)) {
                continue;
            }

            cleanObject[key] = value;
        }

        return cleanObject;
    }

    const newObject = { ...obj };
    const keysArray = Array.isArray(keysOrExclude) ? keysOrExclude : [keysOrExclude];

    for (const key of keysArray) {
        delete newObject[key];
    }

    return newObject;
}

export function objectWithoutEmpty<T extends Obj>(obj: T): ObjectWithout<T, null | undefined>;
export function objectWithoutEmpty<T extends object>(obj: T): ObjectWithout<T, null | undefined>;
export function objectWithoutEmpty<T extends Obj>(obj: T): ObjectWithout<T, null | undefined> {
    return objectWithout(obj, (value): value is null | undefined => value === null || value === undefined);
}

export function overridePrototypeMethod<T, K extends GetObjectMethods<T>>(
    target: Constructor<T>,
    method: K,
    implementation: T[K],
): void {
    target.prototype[method] = implementation;
}

export function toString(value: unknown): string {
    return String(value);
}

export function toError(value: unknown): Error {
    if (value instanceof Error) {
        return value;
    }

    return new Error(toString(value));
}
