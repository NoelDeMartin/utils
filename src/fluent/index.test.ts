import { Equal, Expect } from '../testing/index';
import FluentArrayDefinition, { FluentArray } from './FluentArray';
import FluentStringDefinition, { FluentString } from './FluentString';
import { arr, fluent, str } from './index';

const fluentStringArray = arr(['foo', 'bar']);
const fluentNumbersArray = arr([42]);
const fluentString = str('foobar');

type TypeAssertions =
    Expect<Equal<typeof fluentStringArray, FluentArray<string>>> |
    Expect<Equal<typeof fluentNumbersArray, FluentArray<number>>> |
    Expect<Equal<typeof fluentString, FluentString>> |
    true;

describe('Fluency', () => {

    it('has correct types', () => expect(true as TypeAssertions).toBe(true));

    it('creates fluent objects', () => {
        expect(fluent([42])).toBeInstanceOf(FluentArrayDefinition);
        expect(fluent('foobar')).toBeInstanceOf(FluentStringDefinition);
    });

});
