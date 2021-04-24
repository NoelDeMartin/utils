import type { Falsy } from '@/types/index';

import ObjectsMap from './ObjectsMap';
import type { Obj } from './object_helpers';
import type { ObjectKeyExtractor } from './ObjectsMap';

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

export function arrayIsEmpty(items: unknown[]): boolean {
    return items.length === 0;
}

export function arrayRemove<T>(items: T[], item: T): boolean {
    const index = items.indexOf(item);

    if (index === -1)
        return false;

    items.splice(index, 1);

    return true;
}

export function arraySorted<T>(items: T[], compare?: (a: T, b: T) => number): T[] {
    const sorted = items.slice(0);

    sorted.sort(compare);

    return sorted;
}

export function arrayUnique<T>(items: T[], extractKey?: ObjectKeyExtractor<T>): T[] {
    return (extractKey && typeof items[0] === 'object')
        ? ObjectsMap.createFromArray(items as Obj[], extractKey as ObjectKeyExtractor<Obj>).getItems() as T[]
        : [...new Set(items)];
}

export function arrayWithoutIndexes<T>(items: T[], indexes: number[]): T[] {
    return items
        .map((value, index) => ([value, index] as [T, number]))
        .filter(([_, index]) => !indexes.includes(index))
        .map(([value]) => value);
}
