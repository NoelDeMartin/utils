import { tt } from '@/testing/index';
import type { Equals, Expect } from '@/testing/index';
import type { GetOptionalKeys, GetRequiredKeys } from '@/types/index';

import { objectWithoutEmpty } from './object_helpers';

describe('Object helpers', () => {

    it('removes empty values', () => {
        expect(objectWithoutEmpty({ foo: false, bar: null, baz: undefined })).toEqual({ foo: false });
    });

});

const cleanObject = objectWithoutEmpty({} as unknown as OriginalObject);

type OriginalObject = {
    foo: boolean;
    bar: null;
    baz: undefined;
    qux: string | null;
};

type CleanObject = typeof cleanObject;

describe('Object helpers types', () => {

    it('has correct types', tt<
        Expect<Equals<CleanObject['foo'], boolean>> |
        Expect<Equals<keyof CleanObject, 'foo' | 'qux'>> |
        Expect<Equals<GetRequiredKeys<CleanObject>, 'foo'>> |
        Expect<Equals<GetOptionalKeys<CleanObject>, 'qux'>> |
        true
    >());

});
