import { fail } from '@/helpers/error_helpers';
import type { ValueWithoutEmpty } from '@/helpers/object_helpers';

export function required<T extends object | null | undefined>(
    value: (() => T) | T,
    errorMessage: string,
): ValueWithoutEmpty<T> {
    errorMessage ??= 'Required value is missing';

    if (typeof value === 'function') {
        return new Proxy(
            {},
            {
                get(_, property, receiver) {
                    const model = value() ?? fail<ValueWithoutEmpty<T>>(errorMessage);

                    return Reflect.get(model, property, receiver);
                },
                set(_, property, value, receiver) {
                    const model = value() ?? fail<ValueWithoutEmpty<T>>(errorMessage);

                    return Reflect.set(model, property, value, receiver);
                },
            },
        ) as ValueWithoutEmpty<T>;
    }

    return (value ?? fail(errorMessage)) as ValueWithoutEmpty<T>;
}
