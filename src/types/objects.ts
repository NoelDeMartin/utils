import type { ArrayDeepItem, ArrayIncludes } from '@noeldemartin/utils/types/arrays';
import type { Closure } from '@noeldemartin/utils/types/helpers';

export type DeepKeyOf<T, P extends unknown[] = [], Depth extends number = 2> = NonNullable<
    T extends object
        ? ArrayIncludes<P, ArrayDeepItem<T>> extends true
            ? never
            : {
                  [K in keyof T]: T[K] extends Closure
                      ? never
                      : NonNullable<T[K]> extends Array<unknown>
                        ? Exclude<K, symbol>
                        : Depth extends -1
                          ? never
                          : `${Exclude<K, symbol>}${'' | `.${DeepKeyOf<T[K], [...P, T], [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9][Depth]>}`}`;
              }[keyof T]
        : never
>;

export type DeepValue<T extends object, K> = K extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
        ? T[Key] extends object
            ? DeepValue<T[Key], Rest>
            : T[Key]
        : never
    : K extends keyof T
      ? T[K]
      : never;
