export function value<T>(evaluator: () => T): T;
export function value<T>(evaluator: T): T;
export function value<T>(evaluator: T | (() => T)): T {
    return typeof evaluator === 'function' ? (evaluator as () => T)() : evaluator;
}
