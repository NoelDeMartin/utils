import PromisedValue from '@noeldemartin/utils/helpers/PromisedValue';
import { arrayFrom } from '@noeldemartin/utils/helpers/array_helpers';
import type { Closure, ClosureArgs } from '@noeldemartin/utils/types';

const cache: Record<string, unknown> = {};
const asyncCache: Record<string, PromisedValue> = {};

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

export function resetAsyncMemo(key?: string): void {
    const keys = arrayFrom(key ?? Object.keys(asyncCache));

    keys.forEach((k) => delete asyncCache[k]);
}

export function resetMemo(key?: string): void {
    const keys = arrayFrom(key ?? Object.keys(cache));

    keys.forEach((k) => delete cache[k]);
}

export function setAsyncMemo(key: string, value: unknown): void {
    asyncCache[key] = asyncCache[key] ?? new PromisedValue();

    asyncCache[key]?.resolve(value);
}

export function setMemo(key: string, value: unknown): void {
    cache[key] = value;
}
