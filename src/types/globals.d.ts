// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type Closure<P extends any[] = any[], R = unknown> = (...args: P) => R;

declare type ClassInstance<Class> = Class extends { new(...args: any[]): infer T } ? T : never;
