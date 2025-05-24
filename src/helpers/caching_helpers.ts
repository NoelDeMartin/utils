import PromisedValue from '@noeldemartin/utils/helpers/PromisedValue';
import { arrayFrom } from '@noeldemartin/utils/helpers/array_helpers';
import { fail } from '@noeldemartin/utils/helpers/error_helpers';
import type { Closure, ClosureArgs } from '@noeldemartin/utils/types';

const cache: Record<string, unknown> = {};
const asyncCache: Record<string, PromisedValue> = {};
const weakCache: Record<string, WeakMap<object, unknown>> = {};

export function asyncMemo<T>(key: string, operation: () => Promise<T>): Promise<T> {
    asyncCache[key] = asyncCache[key] ?? PromisedValue.from<unknown>(operation());

    return asyncCache[key] as Promise<T>;
}

export function memo<T>(key: string, operation: () => T): T {
    cache[key] = cache[key] ?? operation();

    return cache[key] as T;
}

export function once<P extends ClosureArgs, R>(operation: Closure<P, R>): Closure<P, R> {
    const memory: { result?: R } = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (...params) => ('result' in memory ? memory.result : ((memory.result = operation(...params)) as any));
}

export function weakMemo<T>(name: string, key: object, operation: () => T): T {
    if (!weakCache[name]?.has(key)) {
        setWeakMemo(name, key, operation());
    }

    return (weakCache[name]?.get(key) as T) ?? fail();
}

export function getAsyncMemo<T>(key: string): Promise<T | null> {
    return Promise.resolve((asyncCache[key] as T) ?? null);
}

export function getMemo<T>(key: string): T | null {
    return (cache[key] as T) ?? null;
}

export function getWeakMemo<T>(name: string, key: object): T | null {
    return (weakCache[name]?.get(key) as T) ?? null;
}

export function resetAsyncMemo(key?: string): void {
    const keys = arrayFrom(key ?? Object.keys(asyncCache));

    keys.forEach((k) => delete asyncCache[k]);
}

export function resetMemo(key?: string): void {
    const keys = arrayFrom(key ?? Object.keys(cache));

    keys.forEach((k) => delete cache[k]);
}

export function resetWeakMemo(name: string, key: object): void {
    weakCache[name]?.delete(key);
}

export function setAsyncMemo(key: string, value: unknown): void {
    asyncCache[key] = asyncCache[key] ?? new PromisedValue();

    asyncCache[key]?.resolve(value);
}

export function setMemo(key: string, value: unknown): void {
    cache[key] = value;
}

export function setWeakMemo(name: string, key: object, value: unknown): void {
    const memo = (weakCache[name] ??= new WeakMap());

    memo.set(key, value);
}
