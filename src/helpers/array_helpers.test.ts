import { arrayContains, arrayFirst, arrayRemove } from './array_helpers';

describe('Array helpers', () => {

    it('contains', () => {
        expect(arrayContains(['foo', 'bar'], 'foo')).toBe(true);
        expect(arrayContains(['foo', 'bar'], 'baz')).toBe(false);
        expect(arrayContains([42], 42)).toBe(true);
        expect(arrayContains([42], 0)).toBe(false);
    });

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

});
