import FluentObjectDefinition, {
    addHelperMethodsToPrototype,
    addPrimitiveMethodsToPrototype,
    FluentInstance,
} from './FluentObject';
import { arrayFirst, arrayRemove, arrayUnique, arrayWithoutIndexes } from '../helpers/array_helpers';

const fluentArrayHelpers: FluentArrayHelpers<unknown> = {
    first: arrayFirst,
    remove: arrayRemove,
    unique: arrayUnique,
    withoutIndexes: arrayWithoutIndexes,
};

export type FluentArrayHelpers<T> = {
    first(items: T[], filter: (item: T) => boolean): T | null;
    remove(items: T[], item: T): boolean;
    unique(items: T[]): T[];
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

    // TODO implement [Symbol.iterator]

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
