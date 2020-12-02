import { stringContains, stringReverse, stringUncapitalize } from '../helpers/string_helpers';

import FluentObject, {
    addHelperMethodsToPrototype,
    addPrimitiveMethodsToPrototype,
    FluentInstance,
} from './FluentObject';

export const fluentStringHelpers = {
    contains: stringContains,
    reverse: stringReverse,
    uncapitalize: stringUncapitalize,
};

export type FluentStringInstance<FluentClass> =
    FluentInstance<FluentClass, string, keyof string, typeof fluentStringHelpers>;

class FluentString extends FluentObject<string> {

    public static create<T>(this: T, value: string = ''): FluentStringInstance<ClassInstance<T>> {
        const { prototype } = this as unknown as {
            prototype: { create(value: string): FluentStringInstance<ClassInstance<T>> };
        };

        return prototype.create(value);
    }

    public toString(): string {
        return this.value;
    }

    protected isPrimitive(value: unknown): value is string {
        return typeof value === 'string';
    }

}

addHelperMethodsToPrototype(FluentString, fluentStringHelpers);
addPrimitiveMethodsToPrototype(FluentString, String);

export default FluentString;
