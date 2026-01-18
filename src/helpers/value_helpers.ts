import type { Truthy } from '@noeldemartin/utils/types';

export type EvaluatesTo<T> = T | (() => T);

export function evaluate<T>(value: EvaluatesTo<T>): T {
    return typeof value === 'function' ? (value as () => T)() : value;
}

export function isTruthy<T>(value: T): value is Truthy<T> {
    return Boolean(value);
}
