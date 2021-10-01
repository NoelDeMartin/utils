export function mock<T>(instance?: Record<string, unknown>): T;
export function mock<T>(methods: string[], instance?: Record<string, unknown>): T;
export function mock<T>(
    methodsOrInstance: string[] | Record<string, unknown> = [],
    instance: Record<string, unknown> = {},
): T {
    instance = Array.isArray(methodsOrInstance) ? instance : methodsOrInstance;

    const methods = Array.isArray(methodsOrInstance) ? methodsOrInstance : [];

    for (const property of Object.getOwnPropertyNames(instance)) {
        const value = instance[property];

        if (typeof value !== 'function') {
            continue;
        }

        instance[property] = jest.fn((...args) => value.call(instance, ...args));
    }

    for (const method of methods) {
        instance[method] = jest.fn();
    }

    return instance as T;
}
