export type Obj = Record<string, unknown>;

export function deepEquals(a: unknown, b: unknown): boolean {
    if (a === b)
        return true;

    if (!isObject(a) || !isObject(b))
        return false;

    if (a instanceof Date && b instanceof Date)
        return a.getTime() === b.getTime();

    if (Object.keys(a).length !== Object.keys(b).length)
        return false;

    return !Object.keys(a).some(key => !deepEquals(a[key], b[key]));
}

export const isArray = Array.isArray;

export function isEmpty(value: unknown): boolean {
    if (value === null || value === undefined)
        return true;

    if (Array.isArray(value) || typeof value === 'string')
        return value.length === 0;

    if (typeof value === 'object')
        return Object.keys(value as Record<string, unknown>).length === 0;

    return false;
}

export function isObject(obj: unknown): obj is Obj {
    return typeof obj === 'object' && obj !== null;
}

export function isNullable(value: unknown): value is undefined | null {
    return typeof value === 'undefined' || value === null;
}

export function objectDeepClone<T extends Obj>(object: T): T {
    object = { ...object };

    for (const property in object) {
        if (!objectPropertyIsObject(object, property))
            continue;

        object[property] = objectDeepClone(object[property]);
    }

    return object;
}

export function objectHasOwnProperty(object: Obj, property: string): boolean {
    return Object.prototype.hasOwnProperty.call(object, property);
}

export function objectPropertyIsObject<T extends string>(object: Obj, property: T): object is { [t in T]: Obj } {
    let value;

    return objectHasOwnProperty(object, property)
        && isObject(value = object[property])
        && value.constructor === Object;
}
