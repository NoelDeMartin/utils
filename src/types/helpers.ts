export type ClassInstance<Class> = Class extends { new(...args: any[]): infer T } ? T : never;
export type Closure<Args extends ClosureArgs = ClosureArgs, Result = unknown> = (...args: Args) => Result;
export type ClosureArgs = any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
export type Falsy = null | undefined | false | 0;
export type GetOptionalKeys<T> = { [K in keyof T]-?: Record<string, never> extends Pick<T, K> ? K : never }[keyof T];
export type GetRequiredKeys<T> = { [K in keyof T]-?: T extends Record<K, T[K]> ? K : never }[keyof T];
export type ReturnType<T extends (...args: any[]) => unknown> = T extends (...args: any[]) => infer R ? R : never;

// Workaround for https://github.com/typescript-eslint/typescript-eslint/issues/3573
export type Use<T> = {}; // eslint-disable-line @typescript-eslint/no-unused-vars
