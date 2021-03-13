export type ClassInstance<Class> = Class extends { new(...args: any[]): infer T } ? T : never;
export type Closure<Args extends ClosureArgs = ClosureArgs, Result = unknown> = (...args: Args) => Result;
export type ClosureArgs = any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
export type Constructor<T> = { new (...args: any[]): T };
export type Falsy = null | undefined | false | 0;
