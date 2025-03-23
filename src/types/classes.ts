import type { ClosureArgs } from './helpers';

export interface Constructor<T = Object> {
    new (...args: any[]): T;
}

export type ReplaceConstructorArgs<T, Args extends ClosureArgs> = T extends {
    new (...args: ClosureArgs): infer Instance;
}
    ? Omit<T, 'new'> & { new (...args: Args): Instance }
    : never;
