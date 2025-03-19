import type { Closure, Falsy } from '@noeldemartin/utils/types/helpers';

import { compare } from './logical_helpers';
import { isIterable, isString, toString } from './object_helpers';

export type ArrayFrom<T> = T extends Iterable<infer TItem> ? TItem[] : T[];

export function arrayClear(items: unknown[]): void {
    items.splice(0, items.length);
}

export function arrayDiff<T>(
    original: T[],
    updated: T[],
    compareValues?: (a: T, b: T) => boolean,
): { added: T[]; removed: T[] } {
    const removed = original.slice(0);
    const added = [];
    const search: (item: T, items: T[]) => number = compareValues
        ? (item, items) => items.findIndex((otherItem) => compareValues(item, otherItem))
        : (item, items) => items.indexOf(item);

    for (const updatedItem of updated) {
        const index = search(updatedItem, removed);

        index !== -1 ? removed.splice(index, 1) : added.push(updatedItem);
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

export function arrayEquals<T>(original: T[], updated: T[]): boolean {
    if (original.length !== updated.length) {
        return false;
    }

    return !original.some((value, index) => updated[index] !== value);
}

export function arrayFilter<T>(items: (T | Falsy)[]): T[];
export function arrayFilter<T>(items: T[], filter: (item: T) => boolean): T[];
export function arrayFilter<T>(items: T[], filter?: (item: T) => boolean): T[] {
    return filter ? items.filter(filter) : items.filter((item) => !!item);
}

export function arrayFirst<T>(items: T[], filter: (item: T) => boolean): T | null {
    for (const item of items) {
        if (!filter(item)) continue;

        return item;
    }

    return null;
}

export function arrayFlatMap<T, R>(items: T[], map: (item: T, index: number) => R[]): R[] {
    return [...items.entries()].flatMap(([index, item]) => map(item, index));
}

export function arrayWithItemAt<T>(items: T[], item: T, index: number): T[] {
    return [...items.slice(0, index + 1), item, ...items.slice(index + 1)];
}

export function arrayGroupBy<TItem, TKey extends string>(
    items: TItem[],
    groupBy: (item: TItem) => TKey
): Partial<Record<TKey, TItem[]>>;
export function arrayGroupBy<TItem, TKey extends keyof TItem>(items: TItem[], groupBy: TKey): Record<string, TItem[]>;
export function arrayGroupBy<TItem>(
    items: TItem[],
    groupBy: string | ((item: TItem) => string),
): Partial<Record<string, TItem[]>> {
    const group =
        typeof groupBy === 'string' ? (item: TItem) => toString(item[groupBy as unknown as keyof TItem]) : groupBy;

    return items.reduce(
        (groups, item) => {
            (groups[group(item)] ??= []).push(item);

            return groups;
        },
        {} as Record<string, TItem[]>,
    );
}

export function arrayIsEmpty(items: unknown[]): boolean {
    return items.length === 0;
}

export function arrayProject<T, S extends keyof T>(items: T[], property: S): T[S][] {
    return items.map((item) => item[property]);
}

export function arrayPull<T>(items: T[], index: number): T | undefined {
    const value = items[index];

    items.splice(index, 1);

    return value;
}

export function arrayRandomItem<T>(items: T[]): T | null {
    return items.length === 0 ? null : (items[Math.floor(Math.random() * items.length)] as T);
}

export function arrayRandomItems<T>(items: T[], count: number): T[] {
    const itemsLeft = items.slice(0);
    const randomItems = [] as T[];

    while (itemsLeft.length > 0 && randomItems.length < count) {
        const index = Math.floor(Math.random() * itemsLeft.length);

        randomItems.push(itemsLeft[index] as T);
        itemsLeft.splice(index, 1);
    }

    return randomItems;
}

export function arrayRemove<T>(items: T[], item: T): boolean {
    const index = items.indexOf(item);

    if (index === -1) return false;

    items.splice(index, 1);

    return true;
}

export function arrayRemoveIndex<T>(items: T[], index: number | string): boolean {
    return items.splice(Number(index), 1).length > 0;
}

export function arrayReplace<T>(items: T[], original: T, replacement: T): boolean {
    const index = items.indexOf(original);

    if (index === -1) return false;

    items[index] = replacement;

    return true;
}

export function arraySorted<T>(items: T[]): T[];
export function arraySorted<T>(items: T[], direction: 'asc' | 'desc'): T[];
export function arraySorted<T>(items: T[], compareValues: (a: T, b: T) => number): T[];
export function arraySorted<T>(items: T[], field: keyof T, direction?: 'asc' | 'desc'): T[];
export function arraySorted<T>(items: T[], fields: (keyof T)[], direction?: 'asc' | 'desc'): T[];
export function arraySorted<T>(
    items: T[],
    compareOrFieldOrDirection?: keyof T | (keyof T)[] | ((a: T, b: T) => number) | 'asc' | 'desc',
    direction?: 'asc' | 'desc',
): T[] {
    direction =
        compareOrFieldOrDirection === 'asc' || compareOrFieldOrDirection === 'desc'
            ? (compareOrFieldOrDirection as 'asc' | 'desc')
            : direction;

    const fieldDefaults: Partial<Record<keyof T, unknown>> = {};
    const getDefaultValue = (sample: unknown): unknown => {
        switch (typeof sample) {
            case 'string':
                return '';
            case 'number':
                return Number.MIN_SAFE_INTEGER;
            case 'boolean':
                return false;
            default:
                return null;
        }
    };
    const getFieldValue = (object: T, field: keyof T): unknown => {
        if (!(field in fieldDefaults)) {
            const sampleValue = items.find((item) => item[field] !== undefined && item[field] !== null)?.[field];

            fieldDefaults[field] = getDefaultValue(sampleValue);
        }

        return object[field] ?? fieldDefaults[field];
    };
    const getComparisonFunction = (): Closure<[T, T], number> | undefined => {
        const compareItems =
            direction === 'desc'
                ? (field: keyof T) => (a: T, b: T) => compare(getFieldValue(b, field), getFieldValue(a, field))
                : (field: keyof T) => (a: T, b: T) => compare(getFieldValue(a, field), getFieldValue(b, field));

        switch (typeof compareOrFieldOrDirection) {
            case 'function':
                return compareOrFieldOrDirection;
            case 'string':
                if (compareOrFieldOrDirection === 'asc') return;

                if (compareOrFieldOrDirection === 'desc') return (a, b) => compare(b, a);

                return compareItems(compareOrFieldOrDirection);
            case 'object': {
                const comparisonFunctions = compareOrFieldOrDirection.map((field) => compareItems(field));

                return (a: T, b: T) => {
                    for (const comparisonFunction of comparisonFunctions) {
                        const result = comparisonFunction(a, b);

                        if (result !== 0) return result;
                    }

                    return 0;
                };
            }
        }
    };

    return items.slice(0).sort(getComparisonFunction());
}

export function arraySwap(items: unknown[], firstIndex: number, secondIndex: number): void {
    [items[firstIndex], items[secondIndex]] = [items[secondIndex], items[firstIndex]];
}

export function arrayUnique<T>(items: T[], extractKey?: (item: T) => string): T[] {
    return extractKey
        ? Object.values(
            items.reduce(
                (unique, item) => {
                    const key = extractKey(item);

                    unique[key] = unique[key] ?? item;

                    return unique;
                },
                  {} as Record<string, T>,
            ),
        )
        : [...new Set(items)];
}

export function arrayFind<T, K extends keyof T>(items: T[], filter: string, value?: T[K]): T | undefined {
    return items.find((item) => {
        const property = item[filter as keyof T];
        const result = typeof property === 'function' ? property.call(item) : property;

        return value ? result === value : !!result;
    });
}

export function arrayWhere<T, K extends keyof T>(items: T[], filter: string, value?: T[K]): T[] {
    return items.filter((item) => {
        const property = item[filter as keyof T];
        const result = typeof property === 'function' ? property.call(item) : property;

        return value ? result === value : !!result;
    });
}

export function arrayWithout<T>(items: T[], exclude: T | T[]): T[] {
    return Array.isArray(exclude)
        ? arrayFilter(items, (item) => exclude.indexOf(item) === -1)
        : arrayWithoutIndex(items, items.indexOf(exclude));
}

export function arrayWithoutIndex<T>(items: T[], index: number): T[] {
    return arrayWithoutIndexes(items, [index]);
}

export function arrayWithoutIndexes<T>(items: T[], indexes: number[]): T[] {
    return items
        .map((value, index) => [value, index] as [T, number])
        .filter(([_, index]) => !indexes.includes(index))
        .map(([value]) => value);
}

export function arrayZip<T>(...arrays: T[][]): T[][] {
    const zippedArrays: T[][] = [];
    const arraysLength = arrays[0]?.length ?? 0;

    for (let i = 0; i < arraysLength; i++) zippedArrays.push(arrays.map((a) => a[i] as T));

    return zippedArrays;
}

export function arrayFrom<T>(value: T, ignoreEmptyValues: boolean = false): ArrayFrom<T> {
    const items =
        Array.isArray(value) || (isIterable(value) && !isString(value))
            ? Array.from(value)
            : ignoreEmptyValues && (value === null || value === undefined)
                ? []
                : [value];

    return items as ArrayFrom<T>;
}

export function range(length: number): number[] {
    return Array.from({ length }, (_, item) => item);
}
