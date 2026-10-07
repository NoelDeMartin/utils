import type { Falsy } from '@noeldemartin/utils/types/helpers';
import type { DeepKeyOf } from '@noeldemartin/utils/types/objects';

import { compare } from './logical_helpers';
import { deepGet, isIterable, isString, toString } from './object_helpers';

export type ArrayFrom<T> = T extends Iterable<infer TItem> ? TItem[] : T[];
export type ArraySortDirection = 'asc' | 'desc';
export type ArraySortFieldDirection<T> = readonly [DeepKeyOf<T>, ArraySortDirection];
export type ArraySortCompare<T> = (a: T, b: T) => number;

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
    groupBy: (item: TItem) => TKey,
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

export function arrayReversed<T>(items: T[]): T[] {
    const reversed = items.slice(0);

    reversed.reverse();

    return reversed;
}

export function arraySorted<T>(items: T[]): T[];
export function arraySorted<T>(items: T[], direction: ArraySortDirection): T[];
export function arraySorted<T>(items: T[], compareValues: ArraySortCompare<T>): T[];
export function arraySorted<T>(items: T[], field: DeepKeyOf<T>, direction?: ArraySortDirection): T[];
export function arraySorted<T>(items: T[], fields: DeepKeyOf<T>[], direction?: ArraySortDirection): T[];
export function arraySorted<T>(items: T[], fields: ArraySortFieldDirection<T>[]): T[];
export function arraySorted<T>(
    items: T[],
    compareOrFieldOrDirection?:
        | ArraySortDirection
        | ArraySortCompare<T>
        | DeepKeyOf<T>
        | DeepKeyOf<T>[]
        | ArraySortFieldDirection<T>[],
    direction?: ArraySortDirection,
): T[] {
    switch (compareOrFieldOrDirection) {
        case undefined:
        case 'asc':
            return items.slice(0).sort(compare);
        case 'desc':
            return items.slice(0).sort((a, b) => compare(b, a));
    }

    if (typeof compareOrFieldOrDirection === 'function') {
        return items.slice(0).sort(compareOrFieldOrDirection);
    }

    const fields =
        typeof compareOrFieldOrDirection === 'string'
            ? [[compareOrFieldOrDirection, direction ?? 'asc'] as const]
            : compareOrFieldOrDirection.map((field) =>
                  typeof field === 'string' ? ([field, direction ?? 'asc'] as const) : field,
              );

    return arraySortedByFields(items, fields);
}

function getSortDefaultValue(values: unknown[]): unknown {
    const sample = values.find((value) => value !== undefined && value !== null);

    switch (typeof sample) {
        case 'string':
            return '';
        case 'number':
            return Number.MIN_SAFE_INTEGER;
        case 'boolean':
            return false;
        default:
            if (sample instanceof Date) {
                return Number.MIN_SAFE_INTEGER;
            }

            return null;
    }
}

function arraySortedByFields<T>(items: T[], fields: readonly ArraySortFieldDirection<T>[]): T[] {
    const sortKeys = fields.map(([field, fieldDirection]) => {
        const values = items.map((item) => deepGet(item as object, field as never) as unknown);
        const defaultValue = getSortDefaultValue(values);

        return {
            values: values.map((value) => (value instanceof Date ? value.getTime() : (value ?? defaultValue))),
            directionSign: fieldDirection === 'desc' ? -1 : 1,
        };
    });
    const indexes = items.map((_, index) => index);

    indexes.sort((a, b) => {
        for (const { values, directionSign } of sortKeys) {
            const result = compare(values[a], values[b]);

            if (result !== 0) return result * directionSign;
        }

        return 0;
    });

    return indexes.map((index) => items[index] as T);
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

export function arrayFrom<TValue, TOptions extends { ignoreEmptyValues?: boolean }>(
    value: TValue,
    options?: TOptions,
): TOptions extends { ignoreEmptyValues: true } ? ArrayFrom<NonNullable<TValue>> : ArrayFrom<TValue> {
    const ignoreEmptyValues = options?.ignoreEmptyValues ?? false;
    const items =
        Array.isArray(value) || (isIterable(value) && !isString(value))
            ? Array.from(value)
            : ignoreEmptyValues && (value === null || value === undefined)
              ? []
              : [value];

    return items as TOptions extends { ignoreEmptyValues: true } ? ArrayFrom<NonNullable<TValue>> : ArrayFrom<TValue>;
}

export function hasItems<T>(array: T[]): array is [T, ...T[]] {
    return array.length > 0;
}

export function range(length: number): number[] {
    return Array.from({ length }, (_, item) => item);
}

export function reduceBy<TItem, TKey extends keyof TItem, TProjection>(
    items: TItem[],
    key: TKey,
    project: (item: TItem) => TProjection,
): Record<string, TProjection>;
export function reduceBy<TItem, TKey extends keyof TItem>(items: TItem[], key: TKey): Record<string, TItem>;
export function reduceBy<TItem, TKey extends keyof TItem, TProjection>(
    items: TItem[],
    key: TKey,
    project?: (item: TItem) => TProjection,
): Record<string, TProjection> {
    return items.reduce(
        (acc, item) => {
            acc[toString(item[key])] = project ? project(item) : (item as unknown as TProjection);

            return acc;
        },
        {} as Record<string, TProjection>,
    );
}
