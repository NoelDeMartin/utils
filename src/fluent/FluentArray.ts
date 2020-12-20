import FluentObjectDefinition, {
    addHelperMethodsToPrototype,
    addPrimitiveMethodsToPrototype,
    FluentInstance,
} from './FluentObject';
import { arrayContains, arrayFirst, arrayRemove } from '../helpers/array_helpers';

const fluentArrayHelpers: FluentArrayHelpers<unknown> = {
    contains: arrayContains,
    first: arrayFirst,
    remove: arrayRemove,
};

export type FluentArrayHelpers<T> = {
    contains(items: T[], item: T): boolean;
    first(items: T[], filter: (item: T) => boolean): T | null;
    remove(items: T[], item: T): boolean;
}

export type FluentArrayInstance<FluentClass, Item> =
    FluentInstance<FluentClass, Array<Item>, keyof Array<Item>, FluentArrayHelpers<Item>>;

export type FluentArray<T> = FluentArrayInstance<FluentArrayDefinition<T>, T>;

class FluentArrayDefinition<Item> extends FluentObjectDefinition<Array<Item>> {

    public static create<T>(value: Array<T> = []): FluentArrayInstance<FluentArrayDefinition<T>, T> {
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
