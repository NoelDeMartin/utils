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
