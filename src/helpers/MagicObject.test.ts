import { describe, expect, it } from 'vitest';
import { tt } from '@noeldemartin/testing';
import type { Expect } from '@noeldemartin/testing';

import { stringToCamelCase } from '@noeldemartin/utils/helpers/string_helpers';
import type { Equals } from '@noeldemartin/utils/types';

import MagicObject from './MagicObject';

type Attributes = Record<string, unknown>;

class Stub extends MagicObject {

    public static globalName: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [property: string]: any;

    public constructor(attributes: Attributes = {}) {
        super();

        this.initializeAttributes(attributes);
    }

    public getAttributes(): Attributes {
        return this.attributes;
    }

    public static<T extends typeof Stub>(): T;
    public static<T extends typeof Stub, K extends keyof T>(property: K): T[K];
    public static<T extends typeof Stub, K extends keyof T>(property?: K): T | T[K] {
        return super.static<T, K>(property as K);
    }

    protected initializeAttributes(attributes: Attributes): void {
        if (this.static().isConjuring()) {
            this.reserveProperty('attributes');

            return;
        }

        this.attributes = Object.entries(attributes).reduce((_attributes, [name, value]) => {
            _attributes[stringToCamelCase(name)] = value;

            return _attributes;
        }, {} as Attributes);
    }

    protected __get(property: string): unknown {
        return this.attributes[property];
    }

    protected __set(property: string, value: unknown): void {
        this.attributes[property] = value;
    }

    protected __delete(property: string): void {
        delete this.attributes[property];
    }

}

describe('MagicObject', () => {

    it('Intercepts getters and setters', () => {
        // Arrange
        const object = new Stub({ lorem: 'ipsum' });

        // Act
        object.foo = 'bar';

        // Assert
        expect(object.foo).toEqual('bar');
        expect(object.lorem).toEqual('ipsum');
        expect(object.getAttributes()).toEqual({
            lorem: 'ipsum',
            foo: 'bar',
        });
    });

    it('Intercepts delete', () => {
        // Arrange
        const object = new Stub({ lorem: 'ipsum' });

        // Act
        delete object.lorem;

        // Assert
        expect(object.lorem).toBeUndefined();
        expect(object.getAttributes()).toEqual({});
    });

    it('Runs methods in constructor', () => {
        // Act
        const object = new Stub({ 'foo-bar': true });

        // Assert
        expect(object['foo-bar']).toBeUndefined();
        expect(object.fooBar).toBe(true);
    });

});

const instance = new Stub();
const globalName = instance.static().globalName;
const globalNameShortcut = instance.static('globalName');

describe('MagicObject types', () => {

    it(
        'has correct types',
        tt<Expect<Equals<typeof globalName, string>> | Expect<Equals<typeof globalNameShortcut, string>> | true>(),
    );

});
