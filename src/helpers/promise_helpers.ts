import type { Closure, ClosureArgs } from '@noeldemartin/utils/types';

export async function asyncFirst<TValue, TResult>(
    values: TValue[],
    operation: (value: TValue) => Promise<TResult | null>,
): Promise<TResult | null> {
    for (const value of values) {
        const result = await operation(value);

        if (!result) {
            continue;
        }

        return result;
    }

    return null;
}

export function isPromise(p: unknown): p is Promise<unknown> {
    return 'then' in (p as Promise<unknown>);
}

export function silenced<Args extends ClosureArgs, Result>(
    operation: Closure<Args, Promise<Result>>
): Closure<Args, Promise<Result | null>>;
export function silenced<Args extends ClosureArgs, Result, Default>(
    operation: Closure<Args, Promise<Result>>,
    defaultValue: Default
): Closure<Args, Promise<Result | Default>>;
export function silenced<Result>(promise: Promise<Result>): Promise<Result | null>;
export function silenced<Args extends ClosureArgs, Result, Default>(
    operation: Closure<Args, Promise<Result>>,
    defaultValue: Default
): Closure<Args, Promise<Result | Default>>;
export function silenced<Args extends ClosureArgs, Result, Default>(
    operationOrPromise: Closure<Args, Promise<Result>> | Promise<Result>,
    defaultValue: Default | null = null,
): Closure<Args, Promise<Result | Default | null>> | Promise<Result | Default | null> {
    return typeof operationOrPromise !== 'function'
        ? operationOrPromise.catch(() => defaultValue)
        : async (...args: Args) => {
            try {
                return await operationOrPromise(...args);
            } catch (error) {
                return defaultValue ?? null;
            }
        };
}
