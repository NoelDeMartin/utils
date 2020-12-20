export function silenced<Args extends ClosureArgs, Result>(
    operation: Closure<Args, Promise<Result>>,
): Closure<Args, Promise<Result | null>>;
export function silenced<Args extends ClosureArgs, Result, Default>(
    operation: Closure<Args, Promise<Result>>,
    defaultValue: Default,
): Closure<Args, Promise<Result | Default>>;
export function silenced<Args extends ClosureArgs, Result, Default>(
    operation: Closure<Args, Promise<Result>>,
    defaultValue: Default | null = null,
): Closure<Args, Promise<Result | Default | null>> {
    return async (...args: Args) => {
        try {
            return await operation(...args);
        } catch (error) {
            return defaultValue || null;
        }
    };
}
