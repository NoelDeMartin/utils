declare type Closure<Return = unknown> = (...args: any[]) => Return;
declare type ClassInstance<Class> = Class extends { new(...args: any[]): infer T } ? T : never;
