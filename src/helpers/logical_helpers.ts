export function compare<T>(a: T, b: T): 1 | -1 | 0 {
    return a > b ? 1 : (b > a ? -1 : 0);
}
