import type { Closure, ClosureArgs, Constructor } from '@noeldemartin/utils/types';

export interface SilencedOptions<Default = null> {
    default?: Default;
    only?: Constructor<Error> | Constructor<Error>[];
}

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

export function silenced<Result, Default>(
    promise: Promise<Result>,
    options: SilencedOptions<Default> & { default: Default },
): Promise<Result | Default>;
export function silenced<Result>(promise: Promise<Result>, options?: SilencedOptions): Promise<Result | null>;
export function silenced<Args extends ClosureArgs, Result, Default>(
    operation: Closure<Args, Promise<Result>>,
    options: SilencedOptions<Default> & { default: Default },
): Closure<Args, Promise<Result | Default>>;
export function silenced<Args extends ClosureArgs, Result>(
    operation: Closure<Args, Promise<Result>>,
    options?: SilencedOptions,
): Closure<Args, Promise<Result | null>>;
export function silenced<Args extends ClosureArgs, Result, Default>(
    operationOrPromise: Closure<Args, Promise<Result>> | Promise<Result>,
    options: SilencedOptions<Default | null> = {},
): Closure<Args, Promise<Result | Default | null>> | Promise<Result | Default | null> {
    const errorClasses = options.only && (Array.isArray(options.only) ? options.only : [options.only]);
    const silence = (error: unknown): Default | null => {
        if (errorClasses && !errorClasses.some((errorClass) => error instanceof errorClass)) {
            throw error;
        }

        return 'default' in options ? (options.default as Default) : null;
    };

    return typeof operationOrPromise !== 'function'
        ? operationOrPromise.catch(silence)
        : async (...args: Args) => {
              try {
                  return await operationOrPromise(...args);
              } catch (error) {
                  return silence(error);
              }
          };
}
