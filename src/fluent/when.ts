export function when<T extends object>(target: T, condition: () => boolean): T;
export function when<T extends object>(target: T, condition: boolean): T;
// oxlint-disable-next-line typescript/no-explicit-any, typescript/explicit-module-boundary-types
export function when<T extends object>(target: any, condition: (t: any) => t is T): T;
export function when<T extends object>(target: T, condition: unknown): T {
    const success = typeof condition === 'function' ? condition(target) : !!condition;

    return new Proxy(target, {
        get(_target, property, receiver) {
            // oxlint-disable-next-line typescript/no-empty-function
            return success ? Reflect.get(_target, property, receiver) : () => {};
        },
    }) as unknown as T;
}
