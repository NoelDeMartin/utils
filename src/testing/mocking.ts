import { getClassMethods } from '@/helpers/object_helpers';
import { testing } from '@/testing/namespace';
import type { Obj } from '@/helpers/object_helpers';

export type Mock<T> = T;

export function mock<T extends object>(instance?: T | Obj | object): Mock<T>;
export function mock<T extends object>(methods: string[], instance?: T | Obj | object): Mock<T>;
export function mock<T extends object>(
    methodsOrInstance: string[] | T | Obj | object = [],
    defaultInstance: T | Obj | object = {},
): Mock<T> {
    const instance = (Array.isArray(methodsOrInstance) ? defaultInstance : methodsOrInstance) as T;
    const methods = (Array.isArray(methodsOrInstance) ? methodsOrInstance : []) as Array<keyof T>;
    const properties = getClassMethods(instance);

    for (const property of properties) {
        const value = instance[property as keyof T];

        if (typeof value !== 'function') {
            continue;
        }

        instance[property as keyof T] =
            testing().fn((...args) => value.call(instance, ...args)) as unknown as T[keyof T];
    }

    for (const method of methods) {
        instance[method] = testing().fn() as unknown as T[keyof T];
    }

    return instance;
}
