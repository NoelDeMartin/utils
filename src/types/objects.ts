export type DeepKeyOf<T> = T extends object
    ? { [K in keyof T]: `${Exclude<K, symbol>}${'' | `.${DeepKeyOf<T[K]>}`}` }[keyof T]
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
