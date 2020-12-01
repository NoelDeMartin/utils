import FluentString from './FluentString';

describe('FluentString', () => {

    it('finds text', () => {
        const fluentString = FluentString.create('foobar');

        expect(fluentString.contains('foo')).toBe(true);
        expect(fluentString.contains('bar')).toBe(true);
        expect(fluentString.contains('baz')).toBe(false);
    });

    it('delegates native calls', () => {
        const fluentString = FluentString.create('foobar');

        expect(fluentString.toUpperCase()).toBeInstanceOf(FluentString);
        expect(fluentString.toUpperCase().toString()).toBe('FOOBAR');
        expect(fluentString.indexOf('bar')).toBe(3);
        expect(fluentString.length).toBe(6);
    });

    it('reproduces proxies in method chains', () => {
        const fluentString = FluentString.create('foobar');

        expect(fluentString.toUpperCase().toLowerCase()).toBeInstanceOf(FluentString);
        expect(fluentString.toUpperCase().toLowerCase().toString()).toBe('foobar');
        expect(fluentString.toUpperCase().uncapitalize().contains('fOO')).toBe(true);
    });

    it('can be subclassed', () => {
        // Arrange
        class SuperFluentString extends FluentString {

            public toUpperCase(): this {
                return this.create('nope');
            }

            public powerUp(): this {
                return this.create('super-' + this.value);
            }

        }

        // Act
        const fluentString = SuperFluentString.create('foobar').concat('');

        // Assert
        expect(fluentString).toBeInstanceOf(SuperFluentString);
        expect(fluentString.toUpperCase().toString()).toBe('nope');
        expect(fluentString.powerUp().toString()).toBe('super-foobar');
    });

});
