import type { ArrayDeepItem, ArrayIncludes } from '@noeldemartin/utils/types/arrays';
import type { Closure, Decrement } from '@noeldemartin/utils/types/helpers';

export type DeepKeyOf<T, Circular extends unknown[] = [], Depth extends number = 3> = NonNullable<
    T extends object
        ? ArrayIncludes<Circular, ArrayDeepItem<T>> extends true
            ? never
            : {
                  [K in keyof T]: T[K] extends Closure
                      ? never
                      : NonNullable<T[K]> extends Array<unknown>
                        ? `${Exclude<K, symbol>}`
                        : Depth extends 0
                          ? never
                          : // eslint-disable-next-line max-len
                            `${Exclude<K, symbol>}${'' | `.${DeepKeyOf<T[K], [...Circular, T], Decrement<Depth>>}`}`;
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
