import { fail } from '@/helpers/error_helpers';
import type { ValueWithout } from '@/helpers/object_helpers';

class RequiredHandler<Target extends object> implements ProxyHandler<Target> {

    constructor(private errorMessage: string, private getValue: () => Target) {}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public get(_: Target, property: string | symbol, receiver: any): any {
        const obj = this.getValue() ?? fail<Target>(this.errorMessage);
        const value = Reflect.get(obj, property, receiver);

        return typeof value === 'function' ? value.bind(obj) : value;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public set?(_: Target, property: string | symbol, value: any, receiver: any): boolean {
        const obj = this.getValue() ?? fail<Target>(this.errorMessage);

        return Reflect.set(obj, property, value, receiver);
    }

    public getPrototypeOf(): object | null {
        const obj = this.getValue() ?? fail<Target>(this.errorMessage);

        return Object.getPrototypeOf(obj);
    }

}

export function required<T extends object | null | undefined>(
    getValue: () => T,
    errorMessage?: string
): ValueWithout<T, null | undefined>;
export function required<T>(value: T, errorMessage?: string): ValueWithout<T, null | undefined>;
export function required<T>(value: (() => T) | T, errorMessage?: string): ValueWithout<T, null | undefined> {
    errorMessage ??= 'Required value is missing';

    if (typeof value === 'function') {
        return new Proxy(
            {},
            new RequiredHandler(errorMessage, value as unknown as () => object),
        ) as ValueWithout<T, null | undefined>;
    }

    return (value ?? fail(errorMessage)) as ValueWithout<T, null | undefined>;
}
