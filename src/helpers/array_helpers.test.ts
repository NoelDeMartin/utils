import { arrayContains } from './array_helpers';

describe('Array helpers', () => {

    it('contains', () => {
        expect(arrayContains(['foo', 'bar'], 'foo')).toBe(true);
        expect(arrayContains(['foo', 'bar'], 'baz')).toBe(false);
        expect(arrayContains([42], 42)).toBe(true);
        expect(arrayContains([42], 0)).toBe(false);
    });

});
