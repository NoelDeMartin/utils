import type { Closure } from '@noeldemartin/utils/types/helpers';

/* eslint-disable max-len */
export type DeepKeyOf<T> = NonNullable<
    T extends object
        ? {
              [K in keyof T]: T[K] extends Closure
                  ? never
                  : NonNullable<T[K]> extends Array<unknown>
                    ? `${Exclude<K, symbol>}`
                    : T[K] extends object
                      ?
                            | {
                                  [KK in keyof T[K]]: T[K][KK] extends Closure
                                      ? never
                                      : NonNullable<T[K][KK]> extends Array<unknown>
                                        ? `${Exclude<K, symbol>}.${Exclude<KK, symbol>}`
                                        : T[K][KK] extends object
                                          ?
                                                | {
                                                      [KKK in keyof T[K][KK]]: T[K][KK][KKK] extends Closure
                                                          ? never
                                                          : `${Exclude<K, symbol>}.${Exclude<KK, symbol>}.${Exclude<KKK, symbol>}`;
                                                  }[keyof T[K][KK]]
                                                | `${Exclude<K, symbol>}.${Exclude<KK, symbol>}`
                                          : `${Exclude<K, symbol>}.${Exclude<KK, symbol>}`;
                              }[keyof T[K]]
                            | `${Exclude<K, symbol>}`
                      : `${Exclude<K, symbol>}`;
          }[keyof T]
        : never
>;
/* eslint-enable max-len */

export type DeepValue<T extends object, K> = K extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
        ? T[Key] extends object
            ? DeepValue<T[Key], Rest>
            : T[Key]
        : never
    : K extends keyof T
      ? T[K]
      : never;
