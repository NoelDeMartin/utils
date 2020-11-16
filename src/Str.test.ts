import Str from './Str';

describe('String helpers', () => {

    it('finds needles within haystacks', () => {
        expect(Str.contains('World', 'Hello World!')).toBe(true);
    });

});
