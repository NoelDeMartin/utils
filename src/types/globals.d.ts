// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type ClosureArgs = any[];
declare type Closure<Return = unknown> = (...args: any[]) => Return;
declare type ClassInstance<Class> = Class extends { new(...args: any[]): infer T } ? T : never;
