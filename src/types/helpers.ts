export type ClassInstance<Class> = Class extends { new(...args: any[]): infer T } ? T : never;
export type Closure<Args extends ClosureArgs = ClosureArgs, Result = unknown> = (...args: Args) => Result;
export type ClosureArgs = any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
export type ClosureResult = any; // eslint-disable-line @typescript-eslint/no-explicit-any
export type Falsy = null | undefined | false | 0;
export type GenericAny = any; // eslint-disable-line @typescript-eslint/no-explicit-any
export type GetClosureArgs<T extends Closure> = T extends (...args: infer Args) => ClosureResult ? Args : never;
export type GetClosureResult<T extends Closure> = T extends (...args: any[]) => infer Result ? Result : never;
export type GetObjectMethods<T> = {
    [K in keyof T]: T[K] extends (...args: ClosureArgs) => ClosureResult ? K : never;
}[keyof T];
export type GetOptionalKeys<T> = { [K in keyof T]-?: Record<string, never> extends Pick<T, K> ? K : never }[keyof T];
export type GetRequiredKeys<T> = { [K in keyof T]-?: T extends Record<K, T[K]> ? K : never }[keyof T];
export type KeyOf<Object, Values> = { [k in keyof Object]: Object[k] extends Values ? k : never; }[keyof Object];
export type ObjectValues<T> = T[keyof T];
export type Pretty<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;
export type VoidClosure<T> = T extends (...args: infer A) => ClosureResult ? (...args: A) => void : never;

// Workaround for https://github.com/typescript-eslint/typescript-eslint/issues/3573
export type Use<T> = {}; // eslint-disable-line @typescript-eslint/no-unused-vars

// These could be removed in Typescript 5+ by rewriting array helpers like this:
// export type ArrayItem<T> = T extends readonly (infer Item)[] ? Item : never;
// export function arrayFilter<const T extends readonly any[]>(items: T): Exclude<ArrayItem<T>, Falsy>[] {
export interface Type<T> extends Function { new (...args: any[]): T }
export type Cast<A, B> = A extends B ? A : B;
export type Narrowable = | string | number | bigint | boolean;
export type Narrow<A> = A extends Type<GenericAny>
    ? A
    : Cast<A, [] | (A extends Narrowable ? A : never) | ({ [K in keyof A]: Narrow<A[K]> })>;
