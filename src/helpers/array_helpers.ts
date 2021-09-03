import type { Falsy } from '@/types/index';

import { compare } from './logical_helpers';
import { isIterable, isString } from './object_helpers';

export function arrayClear(items: unknown[]): void {
    items.splice(0, items.length);
}

export function arrayDiff<T>(original: T[], updated: T[]): { added: T[]; removed: T[] } {
    const removed = original.slice(0);
    const added = [];

    for (const updatedItem of updated) {
        const index = removed.indexOf(updatedItem);

        index !== -1
            ? removed.splice(index, 1)
            : added.push(updatedItem);
    }

    return { added, removed };
}

export function arrayChunk<T>(items: T[], chunkSize: number): T[][] {
    const chunks = [];

    for (let i = 0; i < items.length; i += chunkSize) {
        chunks.push(items.slice(i, i + chunkSize));
    }

    return chunks;
}

export function arrayFilter<T>(items: T[]): Exclude<T, Falsy>[];
export function arrayFilter<T>(items: T[], filter: (item: T) => boolean): T[];
export function arrayFilter<T>(items: T[], filter?: (item: T) => boolean): T[] {
    return filter
        ? items.filter(filter)
        : items.filter(item => !!item);
}

export function arrayFirst<T>(items: T[], filter: (item: T) => boolean): T | null {
    for (const item of items) {
        if (!filter(item))
            continue;

        return item;
    }

    return null;
}

export function arrayFlatMap<T, R>(items: T[], transformation: (item: T, index: number) => R[]): R[] {
    return [...items.entries()].flatMap(([index, item]) => transformation(item, index));
}

export function arrayIsEmpty(items: unknown[]): boolean {
    return items.length === 0;
}

export function arrayProject<T, S extends keyof T>(items: T[], property: S): T[S][] {
    return items.map(item => item[property]);
}

export function arrayPull<T>(items: T[], index: number): T {
    const value = items[index];

    items.splice(index, 1);

    return value;
}

export function arrayRemove<T>(items: T[], item: T): boolean {
    const index = items.indexOf(item);

    if (index === -1)
        return false;

    items.splice(index, 1);

    return true;
}

export function arrayRemoveIndex<T>(items: T[], index: number | string): boolean {
    return items.splice(Number(index), 1).length > 0;
}

export function arrayReplace<T>(items: T[], original: T, replacement: T): boolean {
    const index = items.indexOf(original);

    if (index === -1)
        return false;

    items[index] = replacement;

    return true;
}

export function arraySorted<T>(items: T[]): T[];
export function arraySorted<T>(items: T[], compare?: (a: T, b: T) => number): T[];
export function arraySorted<T>(items: T[], field?: keyof T, direction?: 'asc' | 'desc'): T[];
export function arraySorted<T>(
    items: T[],
    compareOrField?: keyof T | ((a: T, b: T) => number),
    direction?: 'asc' | 'desc',
): T[] {
    const comparisonFn = typeof compareOrField !== 'string'
        ? compareOrField as undefined | ((a: T, b: T) => number)
        : direction === 'desc'
            ? (a: T, b: T) => compare(b[compareOrField], a[compareOrField])
            : (a: T, b: T) => compare(a[compareOrField], b[compareOrField]);

    const sorted = items.slice(0);

    sorted.sort(comparisonFn);

    return sorted;
}

export function arrayUnique<T>(items: T[], extractKey?: (item: T) => string): T[] {
    return extractKey
        ? Object.values(
            items.reduce((unique, item) => {
                const key = extractKey(item);

                unique[key] = unique[key] ?? item;

                return unique;
            }, {} as Record<string, T>),
        )
        : [...new Set(items)];
}

export function arrayWhere<T, K extends keyof T>(items: T[], filter: string, value?: T[K]): T[] {
    return items.filter(item => {
        const property = item[filter as keyof T];
        const result = typeof property === 'function' ? property.call(item) : property;

        return value ? result === value : !!result;
    });
}

export function arrayWithout<T>(items: T[], exclude: T[]): T[] {
    return arrayFilter(items, item => exclude.indexOf(item) === -1);
}

export function arrayWithoutIndexes<T>(items: T[], indexes: number[]): T[] {
    return items
        .map((value, index) => ([value, index] as [T, number]))
        .filter(([_, index]) => !indexes.includes(index))
        .map(([value]) => value);
}

export function arrayZip<T>(...arrays: T[][]): T[][] {
    const zippedArrays: T[][] = [];

    for (let i = 0; i < arrays[0].length; i++)
        zippedArrays.push(arrays.map(a => a[i]));

    return zippedArrays;
}

export function arrayFrom<T>(value: Iterable<T>): T[];
export function arrayFrom<T>(value: T): T[];
export function arrayFrom(value: unknown): unknown[] {
    if (Array.isArray(value))
        return value.slice(0);

    if (isIterable(value) && !isString(value))
        return [...value];

    return [value];
}

export function range(length: number): number[] {
    const items: number[] = [];

    for (let i = 0; i < length; i++)
        items.push(i);

    return items;
}
