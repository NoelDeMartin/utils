// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type ClosureArgs = any[];
declare type Closure<Args = ClosureArgs, Result = unknown> = (...args: Args) => Result;
declare type ClassInstance<Class> = Class extends { new(...args: any[]): infer T } ? T : never;
