import { tt } from '@/testing/index';
import type { Equals, Expect } from '@/testing/index';
import type { GetOptionalKeys, GetRequiredKeys } from '@/types/index';

import { objectWithout, objectWithoutEmpty } from './object_helpers';

describe('Object helpers', () => {

    it('removes keys', () => {
        expect(objectWithout({ foo: 'foo', bar: 'bar' }, ['foo'])).toEqual({ bar: 'bar' });
    });

    it('removes empty values', () => {
        expect(objectWithoutEmpty({ foo: false, bar: null, baz: undefined })).toEqual({ foo: false });
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
