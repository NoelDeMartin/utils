export type EvaluatesTo<T> = T | (() => T);

export function evaluate<T>(value: EvaluatesTo<T>): T {
    return typeof value === 'function'
        ? (value as () => T)()
        : value;
}
