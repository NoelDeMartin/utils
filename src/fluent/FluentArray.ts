import {
    arrayClear,
    arrayDiff,
    arrayFilter,
    arrayFirst,
    arrayFlatMap,
    arrayGroupBy,
    arrayIsEmpty,
    arrayProject,
    arrayRandomItem,
    arrayRandomItems,
    arrayRemove,
    arrayRemoveIndex,
    arrayReplace,
    arraySorted,
    arrayUnique,
    arrayWhere,
    arrayWithout,
    arrayWithoutIndexes,
} from '@noeldemartin/utils/helpers/array_helpers';
import type { Falsy } from '@noeldemartin/utils/types/helpers';

import FluentObjectDefinition, { addHelperMethodsToPrototype, addPrimitiveMethodsToPrototype } from './FluentObject';
import type { FluentInstance } from './FluentObject';

const fluentArrayHelpers: FluentArrayHelpers<unknown> = {
    clear: arrayClear,
    diff: arrayDiff,
    filter: arrayFilter,
    first: arrayFirst,
    flatMap: arrayFlatMap,
    groupBy: arrayGroupBy,
    isEmpty: arrayIsEmpty,
    project: arrayProject,
    randomItem: arrayRandomItem,
    randomItems: arrayRandomItems,
    remove: arrayRemove,
    removeIndex: arrayRemoveIndex,
    replace: arrayReplace,
    sorted: arraySorted,
    unique: arrayUnique,
    where: arrayWhere,
    without: arrayWithout,
    withoutIndexes: arrayWithoutIndexes,
};

export type FluentArrayHelpers<T> = {
    clear(items: T[]): void;
    diff(items: T[], updated: T[]): { added: T[]; removed: T[] };
    first(items: T[], filter: (item: T) => boolean): T | null;
    filter(items: T[], filter?: (item: T) => boolean): T[] | Exclude<T, Falsy>[];
    flatMap<TMapped>(items: T[], map?: (item: T, index: number) => TMapped[]): TMapped[];
    groupBy<TKey extends string>(items: T[], groupBy: (item: T) => TKey): Partial<Record<TKey, T[]>>;
    groupBy<TKey extends keyof T>(items: T[], groupBy: TKey): Record<string, T[]>;
    isEmpty(items: T[]): boolean;
    project(items: T[], property: string): unknown[];
    randomItem(items: T[]): T | null;
    randomItems(items: T[], count: number): T[];
    remove(items: T[], item: T): boolean;
    removeIndex(items: T[], index: number | string): boolean;
    replace(items: T[], original: T, replacement: T): boolean;
    sorted(items: T[]): T[];
    unique(items: T[], extractKey?: (item: T) => string): T[];
    where(items: T[], filter: string, value?: unknown): T[];
    without(items: T[], exclude: T[]): T[];
    withoutIndexes(items: T[], indexes: number[]): T[];
};

export type FluentArrayInstance<FluentClass, Item> = FluentInstance<
    FluentClass,
    Item[],
    keyof Item[],
    FluentArrayHelpers<Item>
>;

export type FluentArray<T> = FluentArrayInstance<FluentArrayDefinition<T>, T>;

class FluentArrayDefinition<Item> extends FluentObjectDefinition<Item[]> {

    public static create<T>(value: T[] = []): FluentArrayInstance<FluentArrayDefinition<T>, T> {
        const { prototype } = this as unknown as {
            prototype: { create(value: T[]): FluentArrayInstance<FluentArrayDefinition<T>, T> };
        };

        return prototype.create(value);
    }

    public *[Symbol.iterator](): Iterator<Item> {
        yield* this.value;
    }

    declare public flatMap: <T>(
        callback: (item: Item, index: number) => T[]
    ) => FluentArrayInstance<FluentArrayDefinition<T>, T>;

    declare public map: <T>(
        callback: (item: Item, index: number) => T
    ) => FluentArrayInstance<FluentArrayDefinition<T>, T>;

    declare public project: <K extends keyof Item>(key: K) => Item[K][];

    declare public where: <K extends keyof Item>(
        key: K,
        value?: Item[K]
    ) => FluentArrayInstance<FluentArrayDefinition<Item>, Item>;

    public get(index: number): Item | undefined {
        return this.value[index];
    }

    public toArray(): Item[] {
        return this.value.slice(0);
    }

    protected isPrimitive(value: unknown): value is Item[] {
        return Array.isArray(value);
    }

}

interface FluentArrayDefinition<Item> {
    filter(): FluentArrayInstance<FluentArrayDefinition<Exclude<Item, Falsy>>, Exclude<Item, Falsy>>;
    filter(filter: (item: Item) => boolean): FluentArrayInstance<FluentArrayDefinition<Item>, Item>;
}

addHelperMethodsToPrototype(FluentArrayDefinition, fluentArrayHelpers);
addPrimitiveMethodsToPrototype(FluentArrayDefinition, Array);

export default FluentArrayDefinition;
