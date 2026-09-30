// oxlint-disable-next-line typescript/no-explicit-any
export function runtimeGlobal<T = any>(): T {
    return typeof global !== 'undefined'
        ? (global as T)
        : typeof globalThis !== 'undefined'
          ? (globalThis as T)
          : (window as T);
}
