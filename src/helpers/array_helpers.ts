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

export function arrayRemove<T>(items: T[], item: T): boolean {
    const index = items.indexOf(item);

    if (index === -1)
        return false;

    items.splice(index, 1);

    return true;
}

export function arrayUnique<T>(items: T[]): T[] {
    const set = new Set(items);

    return [...set];
}

export function arrayWithoutIndexes<T>(items: T[], indexes: number[]): T[] {
    return items
        .map((value, index) => ([value, index] as [T, number]))
        .filter(([_, index]) => !indexes.includes(index))
        .map(([value]) => value);
}
