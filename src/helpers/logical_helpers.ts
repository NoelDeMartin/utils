// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeCompareValues<T>(a: T, b: T): [any, any] {
    if ((a === undefined || a === null) && (b === null || b === undefined)) {
        return [a === null ? 1 : 0, b === null ? 1 : 0];
    }

    return [a ?? null, b ?? null];
}

export function compare<T>(a: T, b: T): 1 | -1 | 0 {
    const [aValue, bValue] = normalizeCompareValues(a, b);

    return aValue > bValue ? 1 : bValue > aValue ? -1 : 0;
}
