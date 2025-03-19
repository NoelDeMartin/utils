import { describe, expect, it } from 'vitest';

import { compare } from './logical_helpers';

describe('Logical helpers', () => {

    it('compares numbers', () => {
        expect(compare(5, 1)).toBe(1);
        expect(compare(1, 5)).toBe(-1);
        expect(compare(1, 1)).toBe(0);
    });

    it('compares dates', () => {
        const now = new Date();
        const past = new Date(Date.now() - 1000);

        expect(compare(now, past)).toBe(1);
        expect(compare(past, now)).toBe(-1);
        expect(compare(now, now)).toBe(0);
    });

    it('compares booleans', () => {
        expect(compare(true, false)).toBe(1);
        expect(compare(false, true)).toBe(-1);
        expect(compare(true, true)).toBe(0);
    });

    it('compares with empty values', () => {
        expect(compare(true, null)).toBe(1);
        expect(compare(null, true)).toBe(-1);
        expect(compare(true, undefined)).toBe(1);
        expect(compare(undefined, true)).toBe(-1);
        expect(compare(null, undefined)).toBe(1);
        expect(compare(undefined, null)).toBe(-1);
        expect(compare(null, null)).toBe(0);
        expect(compare(undefined, undefined)).toBe(0);
    });

});
