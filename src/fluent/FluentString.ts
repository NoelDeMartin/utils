import {
    stringReverse,
    stringToCamelCase,
    stringToSlug,
    stringToStudlyCase,
    stringToTitleCase,
} from '@/helpers/string_helpers';
import type { ClassInstance } from '@/types/index';

import FluentObjectDefinition, {
    addHelperMethodsToPrototype,
    addPrimitiveMethodsToPrototype,
} from './FluentObject';
import type { FluentInstance } from './FluentObject';

export const fluentStringHelpers = {
    reverse: stringReverse,
    toCamelCase: stringToCamelCase,
    toSlug: stringToSlug,
    toStudlyCase: stringToStudlyCase,
    toTitleCase: stringToTitleCase,
};

export type FluentStringInstance<FluentClass> =
    FluentInstance<FluentClass, string, keyof string, typeof fluentStringHelpers>;

export type FluentString = FluentStringInstance<FluentStringDefinition>;

class FluentStringDefinition extends FluentObjectDefinition<string> {

    public static create<T>(this: T, value: string = ''): FluentStringInstance<ClassInstance<T>> {
        const { prototype } = this as unknown as {
            prototype: { create(value: string): FluentStringInstance<ClassInstance<T>> };
        };

        return prototype.create(value);
    }

    public override toString(): string {
        return this.value;
    }

    protected isPrimitive(value: unknown): value is string {
        return typeof value === 'string';
    }

}

addHelperMethodsToPrototype(FluentStringDefinition, fluentStringHelpers);
addPrimitiveMethodsToPrototype(FluentStringDefinition, String);

export default FluentStringDefinition;
