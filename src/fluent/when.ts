export function when<T extends object>(target: T, condition: () => boolean): T;
export function when<T extends object>(target: T, condition: boolean): T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function when<T extends object>(target: any, condition: (t: any) => t is T): T;
export function when<T extends object>(target: T, condition: unknown): T {
    const success = typeof condition === 'function'
        ? condition(target)
        : !!condition;

    return new Proxy(target, {
        get(_target, property, receiver) {
            return success
                ? Reflect.get(_target, property, receiver)
                : () => {}; // eslint-disable-line @typescript-eslint/no-empty-function
        },
    }) as unknown as T;
}
