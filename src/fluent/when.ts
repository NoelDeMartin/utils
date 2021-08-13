import { value } from '@/fluent/value';

export function when<T extends object>(target: T, condition: () => boolean): T;
export function when<T extends object>(target: T, condition: boolean): T;
export function when<T extends object>(target: T, condition: boolean | (() => boolean)): T {
    const success = value(condition);

    return new Proxy(target, {
        get(target, property, receiver) {
            const value = Reflect.get(target, property, receiver);

            return success
                ? value
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                : (typeof value === 'function' ? () => {} : null);
        },
    }) as unknown as T;
}
