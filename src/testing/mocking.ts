import { testing } from '@/testing/namespace';
import type { Obj } from '@/helpers/object_helpers';

export type Mock<T> = T;

export function mock<T>(instance?: T | Obj | object): Mock<T>;
export function mock<T>(methods: string[], instance?: T | Obj | object): Mock<T>;
export function mock<T>(
    methodsOrInstance: string[] | T | Obj | object = [],
    defaultInstance: T | Obj | object = {},
): Mock<T> {
    const instance = (Array.isArray(methodsOrInstance) ? defaultInstance : methodsOrInstance) as T;
    const methods = (Array.isArray(methodsOrInstance) ? methodsOrInstance : []) as Array<keyof T>;
    const properties = new Set<keyof T>();

    let prototype = Object.getPrototypeOf(instance);
    while (prototype.constructor !== Object) {
        Object.getOwnPropertyNames(prototype).forEach(property => properties.add(property as keyof T));

        prototype = Object.getPrototypeOf(prototype);
    }

    properties.delete('constructor' as keyof T);

    for (const property of properties) {
        const value = instance[property];

        if (typeof value !== 'function') {
            continue;
        }

        instance[property] = testing().fn((...args) => value.call(instance, ...args)) as unknown as T[keyof T];
    }

    for (const method of methods) {
        instance[method] = testing().fn() as unknown as T[keyof T];
    }

    return instance;
}
