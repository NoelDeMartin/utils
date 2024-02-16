import PromisedValue from '@/helpers/PromisedValue';
import { arrayFrom } from '@/helpers/array_helpers';
import type { Closure, ClosureArgs } from '@/types/index';

const asyncCache: Record<string, PromisedValue> = {};

export function asyncMemo<T>(key: string, operation: () => Promise<T>): Promise<T> {
    asyncCache[key] = asyncCache[key] ?? PromisedValue.from<unknown>(operation());

    return asyncCache[key] as Promise<T>;
}

export function once<P extends ClosureArgs, R>(operation: Closure<P, R>): Closure<P, R> {
    const memo: { result?: R } = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (...params) => 'result' in memo ? memo.result : (memo.result = operation(...params)) as any;
}

export function resetAsyncMemo(key?: string): void {
    const keys = arrayFrom(key ?? Object.keys(asyncCache));

    keys.forEach(key => delete asyncCache[key]);
}

export function setAsyncMemo(key: string, value: unknown): void {
    asyncCache[key] = asyncCache[key] ?? new PromisedValue();

    asyncCache[key]?.resolve(value);
}
