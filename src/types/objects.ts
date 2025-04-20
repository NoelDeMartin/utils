import type { ArrayDeepItem, ArrayIncludes } from '@noeldemartin/utils/types/arrays';

export type DeepKeyOf<T, P extends unknown[] = []> = T extends object
    ? ArrayIncludes<P, ArrayDeepItem<T>> extends true
        ? never
        : { [K in keyof T]: `${Exclude<K, symbol>}${'' | `.${DeepKeyOf<T[K], [...P, T]>}`}` }[keyof T]
    : never;

export type DeepValue<T extends object, K> = K extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
        ? T[Key] extends object
            ? DeepValue<T[Key], Rest>
            : T[Key]
        : never
    : K extends keyof T
      ? T[K]
      : never;
