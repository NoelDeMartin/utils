import { fail } from '@/helpers/error_helpers';
import type { ValueWithoutEmpty } from '@/helpers/object_helpers';

export function required<T extends object | null | undefined>(
    getValue: () => T,
    errorMessage?: string
): ValueWithoutEmpty<T>;
export function required<T>(value: T, errorMessage?: string): ValueWithoutEmpty<T>;
export function required<T>(value: (() => T) | T, errorMessage?: string): ValueWithoutEmpty<T> {
    errorMessage ??= 'Required value is missing';

    if (typeof value === 'function') {
        const getValue = value as unknown as () => object;

        return new Proxy(
            {},
            {
                get(_, property, receiver) {
                    const obj = getValue() ?? fail<ValueWithoutEmpty<T>>(errorMessage);

                    return Reflect.get(obj, property, receiver);
                },
                set(_, property, value, receiver) {
                    const obj = getValue() ?? fail<ValueWithoutEmpty<T>>(errorMessage);

                    return Reflect.set(obj, property, value, receiver);
                },
                getPrototypeOf() {
                    const obj = getValue() ?? fail<ValueWithoutEmpty<T>>(errorMessage);

                    return Object.getPrototypeOf(obj);
                },
            },
        ) as ValueWithoutEmpty<T>;
    }

    return (value ?? fail(errorMessage)) as ValueWithoutEmpty<T>;
}
