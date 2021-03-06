import { stringReverse, stringToCamelCase, stringToSlug, stringToStudlyCase } from './string_helpers';

describe('String helpers', () => {

    it('reverses string characters', () => {
        expect(stringReverse('foobar')).toEqual('raboof');
    });

    it('converts strings to camelCase', () => {
        expect(stringToCamelCase('foo_bar')).toEqual('fooBar');
        expect(stringToCamelCase('Foo Bar')).toEqual('fooBar');
        expect(stringToCamelCase('fooBar')).toEqual('fooBar');
    });

    it('converts strings to slug', () => {
        expect(stringToSlug('Sin perdón')).toEqual('sin-perdon');
        expect(stringToSlug('Mañana')).toEqual('manana');
        expect(stringToSlug('It\'s always sunny in philadelphia')).toEqual('its-always-sunny-in-philadelphia');
        expect(stringToSlug('already-a-slug')).toEqual('already-a-slug');
    });

    it('converts strings to StudlyCase', () => {
        expect(stringToStudlyCase('foo_bar')).toEqual('FooBar');
        expect(stringToStudlyCase('foo-bar')).toEqual('FooBar');
        expect(stringToStudlyCase('Foo Bar')).toEqual('FooBar');
        expect(stringToStudlyCase('fooBar')).toEqual('FooBar');
    });

});
