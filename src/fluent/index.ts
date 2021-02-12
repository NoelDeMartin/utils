import FluentArray, { FluentArrayInstance } from './FluentArray';
import FluentString, { FluentStringInstance } from './FluentString';

const fluentClasses = [FluentArray, FluentString];

export function str(value: string = ''): FluentStringInstance<FluentString> {
    return FluentString.create(value);
}

export function arr<T>(value: T[] = []): FluentArrayInstance<FluentArray<T>, T> {
    return FluentArray.create(value);
}

export function fluent(value: string): FluentStringInstance<FluentString>;
export function fluent<T>(value: T[]): FluentArrayInstance<FluentArray<T>, T>;
export function fluent(value: unknown): unknown {
    const fluentClass = arr(fluentClasses).first(c => c.isPrimitive(value));

    return fluentClass ? (fluentClass as { create(v: unknown): unknown }).create(value) : null;
}

export { tap } from './tap';
export type { Tapped } from './tap';

export { default as FluentObjectDefinition } from './FluentObject';
export type { FluentHelperMethods, FluentInstance, FluentPrimitiveMethods, Helper, HelperParams } from './FluentObject';

export { default as FluentArrayDefinition } from './FluentArray';
export type { FluentArray, FluentArrayHelpers, FluentArrayInstance } from './FluentArray';

export { default as FluentStringDefinition, fluentStringHelpers } from './FluentString';
export type { FluentString, FluentStringInstance } from './FluentString';
