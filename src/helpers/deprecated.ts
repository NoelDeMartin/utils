import type { Equals } from '@/testing/index';

/**
 * @deprecated use ValueWithout<T, null | undefined> instead.
 */
export type ValueWithoutEmpty<T> = T extends null | undefined ? never : T;

/**
 * @deprecated use ReplaceValues<T, null | undefined> instead.
 */
export type ReplaceEmpty<T> = { [K in keyof T]: ValueWithoutEmpty<T[K]> };

/**
 * @deprecated use GetRequiredKeysWithout<T, null | undefined> instead.
 */
export type GetRequiredKeysWithoutEmpty<T, U extends Record<keyof T, unknown> = ReplaceEmpty<T>> = {
    [K in keyof T]:
        Record<string, never> extends Pick<T, K>
            ? never
            : (
                U[K] extends never
                    ? never
                    : (Equals<T[K], U[K]> extends true ? K : never)
            )
}[keyof T];

/**
 * @deprecated use GetOptionalKeysWithout<T, null | undefined> instead.
 */
export type GetOptionalKeysWithoutEmpty<T, U extends Record<keyof T, unknown> = ReplaceEmpty<T>> = {
    [K in keyof T]:
        Record<string, never> extends Pick<T, K>
            ? K
            : (
                U[K] extends never
                ? never
                : (Equals<T[K], U[K]> extends true ? never : K)
            )
}[keyof T];

/**
 * @deprecated use ObjectWithout<T, null | undefined> instead.
 */
export type ObjectWithoutEmpty<T> =
    { [K in GetRequiredKeysWithoutEmpty<T>]: ValueWithoutEmpty<T[K]> } &
    { [K in GetOptionalKeysWithoutEmpty<T>]?: ValueWithoutEmpty<T[K]> };
