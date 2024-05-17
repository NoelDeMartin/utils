import { clamp } from './math_helpers';

describe('Math helpers', () => {

    it('clamps values', () => {
        expect(clamp(50, 0, 100)).toBe(50);
        expect(clamp(500, 0, 100)).toBe(100);
        expect(clamp(-500, 0, 100)).toBe(0);
    });

});
