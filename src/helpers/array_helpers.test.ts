import type { Equal, Expect } from '@testing/index';

import { arrayFilter, arrayFirst, arrayRemove, arrayUnique, arrayWithoutIndexes } from './array_helpers';

const filteredItems = arrayFilter(['foo', null, 'bar', undefined]);

type TypeAssertions =
    Expect<Equal<typeof filteredItems, string[]>> |
    true;

describe('Array helpers', () => {

    it('has correct types', () => expect(true as TypeAssertions).toBe(true));

    it('finds item matching filter', () => {
        expect(arrayFirst([0, 10, 42], n => n > 10)).toBe(42);
        expect(arrayFirst([0, 10, 42], n => n > 100)).toBeNull();
    });

    it('removes items', () => {
        const items = ['foo', 'bar'];

        expect(arrayRemove(items, 'bar')).toBe(true);
        expect(arrayRemove(items, 'bar')).toBe(false);
        expect(items).toEqual(['foo']);
    });

    it('gets unique items', () => {
        const items = ['foo', 'bar', 'baz', 'foo', 'bar'];

        expect(arrayUnique(items)).toEqual(['foo', 'bar', 'baz']);
        expect(items).toEqual(['foo', 'bar', 'baz', 'foo', 'bar']);
    });

    it('gets items without specified indexes', () => {
        const items = ['foo', 'bar', 'baz'];

        expect(arrayWithoutIndexes(items, [1])).toEqual(['foo', 'baz']);
        expect(arrayWithoutIndexes(items, [0, 2])).toEqual(['bar']);
        expect(items).toEqual(['foo', 'bar', 'baz']);
    });

});
