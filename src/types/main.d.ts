// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ClosureArgs = any[];
export type Closure<Args extends ClosureArgs = ClosureArgs, Result = unknown> = (...args: Args) => Result;
export type ClassInstance<Class> = Class extends { new(...args: any[]): infer T } ? T : never;
export type Falsy = null | undefined | false | 0;
