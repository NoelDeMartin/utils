export type DeepRequired<T> = T extends object
    ? {
          [K in keyof T]-?: NonNullable<T[K]> extends Function
              ? NonNullable<T[K]>
              : NonNullable<T[K]> extends object
                ? DeepRequired<NonNullable<T[K]>>
                : NonNullable<T[K]>;
      }
    : T;

/* eslint-disable max-len */
export type DeepKeyOf<T, TRequired extends DeepRequired<T> = DeepRequired<T>> = NonNullable<
    TRequired extends object
        ? {
              [K in keyof TRequired]: TRequired[K] extends Function
                  ? never
                  : TRequired[K] extends Array<unknown>
                    ? `${Exclude<K, symbol>}`
                    : TRequired[K] extends object
                      ?
                            | {
                                  [KK in keyof TRequired[K]]: TRequired[K][KK] extends Function
                                      ? never
                                      : TRequired[K][KK] extends Array<unknown>
                                        ? `${Exclude<K, symbol>}.${Exclude<KK, symbol>}`
                                        : TRequired[K][KK] extends object
                                          ?
                                                | {
                                                      [KKK in keyof TRequired[K][KK]]: TRequired[K][KK][KKK] extends Function
                                                          ? never
                                                          : `${Exclude<K, symbol>}.${Exclude<KK, symbol>}.${Exclude<KKK, symbol>}`;
                                                  }[keyof TRequired[K][KK]]
                                                | `${Exclude<K, symbol>}.${Exclude<KK, symbol>}`
                                          : `${Exclude<K, symbol>}.${Exclude<KK, symbol>}`;
                              }[keyof TRequired[K]]
                            | `${Exclude<K, symbol>}`
                      : `${Exclude<K, symbol>}`;
          }[keyof TRequired]
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
