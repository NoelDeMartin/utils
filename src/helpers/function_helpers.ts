import type { Closure, ClosureArgs, ClosureResult } from '@/types/helpers';

export type GetClosureKeys<T> = {
    [K in keyof T]: T[K] extends (...args: ClosureArgs) => ClosureResult ? K : never;
}[keyof T];

export type VoidedClosure<T> = T extends (...args: infer A) => ClosureResult ? (...args: A) => void : never;

export function intercept<T, K extends GetClosureKeys<T>>(object: T, method: K, callback: VoidedClosure<T[K]>): void {
    const originalMethod = object[method] as unknown as Closure;

    object[method] = ((...args: ClosureArgs) => {
        (callback as unknown as Closure)(...args);

        return originalMethod.call(object, ...args);
    }) as unknown as T[K];
}
