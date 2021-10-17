// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function runtimeGlobal<T = any>(): T {
    return typeof global !== 'undefined'
        ? global
        : typeof globalThis !== 'undefined'
            ? globalThis
            : window as any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
