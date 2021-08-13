export function when<T extends object>(target: T, condition: () => boolean): T;
export function when<T extends object>(target: T, condition: boolean): T;
export function when<T extends object>(target: unknown, condition: (t: unknown) => t is T): T;
export function when<T extends object>(target: T, condition: unknown): T {
    const success = typeof condition === 'function'
        ? condition(target)
        : !!condition;

    return new Proxy(target, {
        get(target, property, receiver) {
            const value = Reflect.get(target, property, receiver);

            return success
                ? value
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                : (typeof value === 'function' ? () => {} : null);
        },
    }) as unknown as T;
}
