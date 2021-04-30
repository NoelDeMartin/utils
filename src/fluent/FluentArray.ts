import {
    arrayFirst,
    arrayIsEmpty,
    arrayProject,
    arrayRemove,
    arraySorted,
    arrayUnique,
    arrayWhere,
    arrayWithoutIndexes,
} from '@/helpers/array_helpers';

import FluentObjectDefinition, {
    addHelperMethodsToPrototype,
    addPrimitiveMethodsToPrototype,
} from './FluentObject';
import type { FluentInstance } from './FluentObject';

const fluentArrayHelpers: FluentArrayHelpers<unknown> = {
    first: arrayFirst,
    isEmpty: arrayIsEmpty,
    project: arrayProject,
    remove: arrayRemove,
    sorted: arraySorted,
    unique: arrayUnique,
    where: arrayWhere,
    withoutIndexes: arrayWithoutIndexes,
};

export type FluentArrayHelpers<T> = {
    first(items: T[], filter: (item: T) => boolean): T | null;
    isEmpty(items: T[]): boolean;
    project(items: T[], property: string): unknown[];
    remove(items: T[], item: T): boolean;
    sorted(items: T[]): T[];
    unique(items: T[], extractKey?: (item: T) => string): T[];
    where(items: T[], filter: string, value?: unknown): T[];
    withoutIndexes(items: T[], indexes: number[]): T[];
};

export type FluentArrayInstance<FluentClass, Item> =
    FluentInstance<FluentClass, Item[], keyof Item[], FluentArrayHelpers<Item>>;

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

    public project!: <K extends keyof Item>(key: K) => Item[K][];
    public where!: <K extends keyof Item>(key: K, value?: Item[K]) =>
        FluentArrayInstance<FluentArrayDefinition<Item>, Item>;

    public get(index: number): Item {
        return this.value[index];
    }

    public toArray(): Item[] {
        return this.value.slice(0);
    }

    protected isPrimitive(value: unknown): value is Item[] {
        return Array.isArray(value);
    }

}

addHelperMethodsToPrototype(FluentArrayDefinition, fluentArrayHelpers);
addPrimitiveMethodsToPrototype(FluentArrayDefinition, Array);

export default FluentArrayDefinition;
