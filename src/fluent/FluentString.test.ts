import { Equal, Expect } from '../testing/index';
import FluentString, { FluentStringInstance } from './FluentString';

// TODO this should be only declared with types
class SuperFluentString extends FluentString {

    public toUpperCase(): this {
        // TODO this should be able to call super.toUpperCase()

        return this.create('nope');
    }

    public powerUp(): this {
        return this.create('super-' + this.value);
    }

}

const fluentString = FluentString.create();
const superFluentString = SuperFluentString.create();

type FSI<T> = FluentStringInstance<T>;
type TypeAssertions =
    Expect<Equal<typeof fluentString.toUpperCase, () => FSI<FluentString>>> |
    Expect<Equal<typeof fluentString.toSlug, (v?: string) => FSI<FluentString>>> |
    Expect<Equal<typeof superFluentString.powerUp, () => FSI<SuperFluentString>>> |
    true;

describe('FluentString', () => {

    it('has correct types', () => expect(true as TypeAssertions).toBe(true));

    it('delegates to helper methods', () => {
        const fluentString = FluentString.create('foo bar');

        expect(fluentString.toCamelCase().toString()).toBe('fooBar');
        expect(fluentString.toStudlyCase().toString()).toBe('FooBar');
        expect(fluentString.toSlug('~').toString()).toBe('foo~bar');
    });

    it('delegates to primitive methods', () => {
        const fluentString = FluentString.create('foobar');

        expect(fluentString.toUpperCase()).toBeInstanceOf(FluentString);
        expect(fluentString.toCamelCase()).toBeInstanceOf(FluentString);
        expect(fluentString.toUpperCase().toString()).toBe('FOOBAR');
        expect(fluentString.indexOf('bar')).toBe(3);
        expect(fluentString.length).toBe(6);
    });

    it('reproduces in method chains', () => {
        const fluentString = FluentString.create('foobar');

        expect(fluentString.toUpperCase().toLowerCase()).toBeInstanceOf(FluentString);
        expect(fluentString.toUpperCase().toLowerCase().toString()).toBe('foobar');
        expect(fluentString.toUpperCase().reverse().startsWith('RAB')).toBe(true);
    });

    it('can be subclassed', () => {
        const superFluentString = SuperFluentString.create('foobar');

        expect(superFluentString).toBeInstanceOf(SuperFluentString);
        expect(superFluentString.toUpperCase().toString()).toBe('nope');
        expect(superFluentString.powerUp().toString()).toBe('super-foobar');
    });

});
