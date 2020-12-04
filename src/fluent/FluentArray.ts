import FluentObject, {
    addHelperMethodsToPrototype,
    addPrimitiveMethodsToPrototype,
    FluentInstance,
} from './FluentObject';
import { arrayContains, arrayFirst } from '../helpers/array_helpers';

export const fluentArrayHelpers = {
    contains: arrayContains,
    first: arrayFirst,
};

export type FluentArrayInstance<FluentClass, Item> =
    FluentInstance<FluentClass, Array<Item>, keyof Array<Item>, typeof fluentArrayHelpers>;

class FluentArray<Item> extends FluentObject<Array<Item>> {

    public static create<T>(value: Array<T> = []): FluentArrayInstance<FluentArray<T>, T> {
        const { prototype } = this as unknown as {
            prototype: { create(value: T[]): FluentArrayInstance<FluentArray<T>, T> };
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

addHelperMethodsToPrototype(FluentArray, fluentArrayHelpers);
addPrimitiveMethodsToPrototype(FluentArray, Array);

export default FluentArray;
