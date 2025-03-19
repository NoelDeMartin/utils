import { describe, expect, it } from 'vitest';

import { clamp, round } from './math_helpers';

describe('Math helpers', () => {

    it('clamps values', () => {
        expect(clamp(50, 0, 100)).toBe(50);
        expect(clamp(500, 0, 100)).toBe(100);
        expect(clamp(-500, 0, 100)).toBe(0);
    });

    it('rounds values', () => {
        expect(round(1.23456)).toBe(1);
        expect(round(1.23456, 1)).toBe(1.2);
        expect(round(1.23456, 2)).toBe(1.23);
        expect(round(1.23456, 3)).toBe(1.235);
        expect(round(1 / 3, 2)).toBe(0.33);
    });

});
