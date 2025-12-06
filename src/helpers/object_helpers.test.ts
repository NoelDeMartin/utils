import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { tt } from '@noeldemartin/testing';
import type { Expect } from '@noeldemartin/testing';

import type { Equals, GetOptionalKeys, GetRequiredKeys } from '@noeldemartin/utils/types/helpers';

import {
    deepGet,
    deepSet,
    getClassMethods,
    monkeyPatch,
    objectDeepClone,
    objectEntries,
    objectOnly,
    objectWithout,
    objectWithoutEmpty,
} from './object_helpers';

describe('Object helpers', () => {

    it('gets class methods', () => {
        // Arrange
        class Foo {

            public hello(): void {
                //
            }
        
        }

        class Bar extends Foo {

            public goodbye(): void {
                //
            }
        
        }

        // Act
        const classMethods = getClassMethods(Bar);
        const instanceMethods = getClassMethods(new Bar());

        // Assert
        expect(classMethods).toHaveLength(2);
        expect(classMethods).toContain('hello');
        expect(classMethods).toContain('goodbye');
        expect(instanceMethods).toEqual(classMethods);
    });

    it('patches methods', () => {
        // Arrange
        class Computer {

            public foo: string = '';

            public run(question: string): number {
                question;

                return 42;
            }
        
        }

        const computer = new Computer();
        const callback = vi.fn();

        monkeyPatch(computer, 'run', (question) => callback(`Question: ${question}`));

        // Act
        const result = computer.run('What\'s the meaning of life?');

        // Assert
        expect(result).toEqual(42);
        expect(callback).toHaveBeenCalledWith('Question: What\'s the meaning of life?');
    });

    it('removes keys', () => {
        expect(objectWithout({ foo: 'foo', bar: 'bar' }, ['foo'])).toEqual({ bar: 'bar' });
    });

    it('removes empty values', () => {
        interface MyObject {
            foo: boolean;
            bar: null;
            baz: undefined;
        }

        expect(objectWithoutEmpty<MyObject>({ foo: false, bar: null, baz: undefined })).toEqual({ foo: false });
    });

    it('clones Dates properly', () => {
        const date = new Date(Date.now() - 42);

        expect(date.toISOString()).toEqual(objectDeepClone({ date }).date.toISOString());
    });

    it('gets subset', () => {
        class Stub {

            public foo = true;
            public bar = false;
        
        }

        expect(objectOnly({ foo: true, bar: false }, 'foo')).toEqual({ foo: true });
        expect(objectOnly({ foo: true, bar: false }, ['foo'])).toEqual({ foo: true });
        expect(objectOnly(new Stub(), 'foo')).toEqual({ foo: true });
        expect(objectOnly(new Stub(), ['foo'])).toEqual({ foo: true });
    });

    it('gets typed entries', () => {
        const partialObject = {} as Partial<Record<'a' | 'b', number>>;
        const objectWithUndefined = {} as Record<'a' | 'b', number | undefined>;
        const objectWithOptional = {} as { a?: number; b: number };
        const objectWithOptionalAndRequired = {} as { a?: number; b: number | undefined };

        expectTypeOf(objectEntries(partialObject)).toEqualTypeOf<['a' | 'b', number][]>();
        expectTypeOf(objectEntries(objectWithUndefined)).toEqualTypeOf<['a' | 'b', number | undefined][]>();
        expectTypeOf(objectEntries(objectWithOptional)).toEqualTypeOf<['a' | 'b', number][]>();
        expectTypeOf(objectEntries(objectWithOptionalAndRequired)).toEqualTypeOf<['a' | 'b', number | undefined][]>();
    });

    it('gets deep value', () => {
        const post = {
            id: 42,
            title: 'Hello, world!',
            author: {
                id: 1,
                name: 'John Doe',
            },
            friends: [
                { id: 2, name: 'Jane Doe' },
                { id: 3, name: 'Jim Doe' },
            ],
        };

        expect(deepGet(post, 'author')).toEqual({ id: 1, name: 'John Doe' });
        expect(deepGet(post, 'author.name')).toEqual('John Doe');
        expect(deepGet(post, 'friends.0.name')).toEqual('Jane Doe');
        expect(deepGet(post, 'friends.1.name')).toEqual('Jim Doe');
    });

    it('sets deep value', () => {
        const post = {
            id: 42,
            title: 'Hello, world!',
            author: {
                id: 1,
                name: 'John Doe',
            },
        };

        deepSet(post, 'author.name', 'Jane Doe');

        expect(post).toEqual({
            id: 42,
            title: 'Hello, world!',
            author: { id: 1, name: 'Jane Doe' },
        });
    });

});

type Original = {
    foo: boolean;
    bar: null;
    baz: undefined;
    qux: string | null;
};

type OriginalWithoutFoo = typeof originalWithoutFoo;
type OriginalWithoutEmpty = typeof originalWithoutEmpty;

const original = {} as unknown as Original;
const originalWithoutFoo = objectWithout(original, ['foo']);
const originalWithoutEmpty = objectWithoutEmpty(original);

describe('Object helpers types', () => {

    it('gets typed entries', () => {
        const partialObject = {} as Partial<Record<'a' | 'b', number>>;
        const objectWithUndefined = {} as Record<'a' | 'b', number | undefined>;
        const objectWithOptional = {} as { a?: number; b: number };
        const objectWithOptionalAndRequired = {} as { a?: number; b: number | undefined };

        expectTypeOf(objectEntries(partialObject)).toEqualTypeOf<['a' | 'b', number][]>();
        expectTypeOf(objectEntries(objectWithUndefined)).toEqualTypeOf<['a' | 'b', number | undefined][]>();
        expectTypeOf(objectEntries(objectWithOptional)).toEqualTypeOf<['a' | 'b', number][]>();
        expectTypeOf(objectEntries(objectWithOptionalAndRequired)).toEqualTypeOf<['a' | 'b', number | undefined][]>();
    });

    it(
        'has correct types',
        tt<
            | Expect<Equals<OriginalWithoutEmpty['foo'], boolean>>
            | Expect<Equals<keyof OriginalWithoutEmpty, 'foo' | 'qux'>>
            | Expect<Equals<GetRequiredKeys<OriginalWithoutEmpty>, 'foo'>>
            | Expect<Equals<GetOptionalKeys<OriginalWithoutEmpty>, 'qux'>>
            | Expect<Equals<OriginalWithoutFoo, Omit<Original, 'foo'>>>
            | true
        >(),
    );

});
