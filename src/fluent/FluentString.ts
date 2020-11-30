import * as stringHelpers from '../helpers/string_helpers';

import FluentObject, { FluentProxy } from './FluentObject';

export type FluentStringProxy<T> = FluentProxy<T, string, keyof string, typeof stringHelpers, 'string'>;

export default class FluentString extends FluentObject<string> {

    // TODO infer static this
    public static create<T>(value: string = ''): FluentStringProxy<T> {
        return new this(value) as unknown as FluentStringProxy<T>;
    }

    constructor(value: string = '') {
        super(value, 'string', stringHelpers);

        return this.createProxy() as unknown as this;
    }

    public toString(): string {
        return this.value;
    }

    protected isPrimitive(value: unknown): value is string {
        return typeof value === 'string';
    }

}
