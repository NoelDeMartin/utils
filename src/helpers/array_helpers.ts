export function arrayContains<T>(items: Array<T>, item: T): boolean {
    return items.indexOf(item) !== -1;
}
