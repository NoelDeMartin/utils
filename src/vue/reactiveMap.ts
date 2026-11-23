import type { KeyOf } from '@noeldemartin/utils/types/helpers';
import { shallowRef, triggerRef } from 'vue';

function createItemsMap<T>(values: Iterable<T>, getKey: (item: T) => unknown) {
    return new Map(Array.from(values, (item) => [getKey(item), item]));
}

function createGetKey<T>(key?: keyof T | ((item: T) => unknown)): (item: T) => unknown {
    if (typeof key === 'function') {
        return key;
    }

    if (key === undefined) {
        return (item) => item;
    }

    return (item) => item[key];
}

// oxlint-disable-next-line typescript/explicit-module-boundary-types
export function reactiveMap<T, K = unknown>(
    initial?: Iterable<T>,
    options: { key?: KeyOf<T, K> | ((item: T) => K) } = {},
) {
    const getKey = createGetKey(options.key);
    const items = shallowRef(createItemsMap(initial ?? [], getKey));

    return {
        get(key: K): T | undefined {
            return items.value.get(key);
        },
        values(): T[] {
            return Array.from(items.value.values());
        },
        has(item: T): boolean {
            return items.value.has(getKey(item));
        },
        add(item: T): void {
            const key = getKey(item);

            if (!items.value.has(key)) {
                items.value.set(key, item);
            }

            triggerRef(items);
        },
        replace(item: T): void {
            items.value.set(getKey(item), item);
            triggerRef(items);
        },
        delete(item: T): void {
            items.value.delete(getKey(item));
            triggerRef(items);
        },
        clear(): void {
            items.value.clear();
            triggerRef(items);
        },
        reset(newItems?: Iterable<T>): void {
            items.value = createItemsMap(newItems ?? [], getKey);
        },
    };
}

export type ReactiveMap<T = unknown, K = unknown> = ReturnType<typeof reactiveMap<T, K>>;
