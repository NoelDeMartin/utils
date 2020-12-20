export function arrayContains<T>(items: Array<T>, item: T): boolean {
    return items.indexOf(item) !== -1;
}

export function arrayFirst<T>(items: Array<T>, filter: (item: T) => boolean): T | null {
    for (const item of items) {
        if (!filter(item))
            continue;

        return item;
    }

    return null;
}

export function arrayRemove<T>(items: Array<T>, item: T): boolean {
    const index = items.indexOf(item);

    if (index === -1)
        return false;

    items.splice(index, 1);

    return true;
}
