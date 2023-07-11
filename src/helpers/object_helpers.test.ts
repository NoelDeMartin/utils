import { tt } from '@/testing/index';
import type { Equals, Expect } from '@/testing/index';
import type { GetOptionalKeys, GetRequiredKeys } from '@/types/index';

import { getClassMethods, objectDeepClone, objectWithout, objectWithoutEmpty } from './object_helpers';

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
        const instanceMethods = getClassMethods(new Bar);

        // Assert
        expect(classMethods).toHaveLength(2);
        expect(classMethods).toContain('hello');
        expect(classMethods).toContain('goodbye');
        expect(instanceMethods).toEqual(classMethods);
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

    it('has correct types', tt<
        Expect<Equals<OriginalWithoutEmpty['foo'], boolean>> |
        Expect<Equals<keyof OriginalWithoutEmpty, 'foo' | 'qux'>> |
        Expect<Equals<GetRequiredKeys<OriginalWithoutEmpty>, 'foo'>> |
        Expect<Equals<GetOptionalKeys<OriginalWithoutEmpty>, 'qux'>> |
        Expect<Equals<OriginalWithoutFoo, Omit<Original, 'foo'>>> |
        true
    >());

});
