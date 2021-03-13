import { tt } from '@/testing/index';
import type { Equals, Expect } from '@/testing/index';

import { arr, fluent, str } from './index';
import FluentArrayDefinition from './FluentArray';
import FluentStringDefinition from './FluentString';
import type { FluentArray } from './FluentArray';
import type { FluentString } from './FluentString';

describe('Fluency', () => {

    it('creates fluent objects', () => {
        expect(fluent([42])).toBeInstanceOf(FluentArrayDefinition);
        expect(fluent('foobar')).toBeInstanceOf(FluentStringDefinition);
    });

});

const fluentStringArray = arr(['foo', 'bar']);
const fluentNumbersArray = arr([42]);
const fluentString = str('foobar');

describe('Fluency types', () => {

    it('has correct types', tt<
        Expect<Equals<typeof fluentStringArray, FluentArray<string>>> |
        Expect<Equals<typeof fluentNumbersArray, FluentArray<number>>> |
        Expect<Equals<typeof fluentString, FluentString>> |
        true
    >());

});
