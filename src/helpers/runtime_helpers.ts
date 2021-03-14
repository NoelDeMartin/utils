export function runtimeGlobal(): Window & typeof globalThis | NodeJS.Global {
    return typeof global !== 'undefined'
        ? global
        : typeof globalThis !== 'undefined'
            ? globalThis
            : window as any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
