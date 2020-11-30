import { stringContains, stringReverse, stringUncapitalize } from './string_helpers';

describe('String helpers', () => {

    it('contains', () => {
        expect(stringContains('Hello World!', 'World')).toBe(true);
        expect(stringContains('Hello World!', 'Foobar')).toBe(false);
    });

    it('reverse', () => {
        expect(stringReverse('foobar')).toEqual('raboof');
    });

    it('uncapitalize', () => {
        expect(stringUncapitalize('FooBar')).toEqual('fooBar');
    });

});
