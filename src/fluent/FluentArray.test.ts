import { Equal, Expect } from '../testing/index';
import FluentArrayDefinition, { FluentArray, FluentArrayInstance } from './FluentArray';

const fluentStringsArray = FluentArrayDefinition.create(['foo']);
const fluentNumbersArray = FluentArrayDefinition.create([42]);

type TypeAssertions =
    Expect<Equal<typeof fluentStringsArray.slice, (s?: number, e?: number) => FluentArray<string>>> |
    Expect<Equal<typeof fluentNumbersArray.slice, (s?: number, e?: number) => FluentArray<number>>> |
    Expect<Equal<typeof fluentStringsArray.contains, (i: string) => boolean>> |
    Expect<Equal<typeof fluentNumbersArray.contains, (i: number) => boolean>> |
    true;

describe('FluentArray', () => {

    it('has correct types', () => expect(true as TypeAssertions).toBe(true));

    it('delegates to helper methods', () => {
        const fluentArray = FluentArrayDefinition.create(['foo', 'bar']);

        expect(fluentArray.contains('foo')).toBe(true);
        expect(fluentArray.contains('bar')).toBe(true);
        expect(fluentArray.contains('baz')).toBe(false);
    });

    it('delegates to primitive methods', () => {
        const fluentArray = FluentArrayDefinition.create(['foo', 'bar']);

        expect(fluentArray.indexOf('foo')).toBe(0);
        expect(fluentArray.indexOf('bar')).toBe(1);
    });

    it('reproduces in method chains', () => {
        const fluentArray = FluentArrayDefinition.create(['foo', 'bar']);

        expect(fluentArray.concat(['baz']).concat(['qux'])).toBeInstanceOf(FluentArrayDefinition);
        expect(fluentArray.concat(['baz']).concat(['qux']).toArray()).toEqual(['foo', 'bar', 'baz', 'qux']);
        expect(fluentArray.concat(['baz']).contains('baz')).toBe(true);
    });

    it('infers item types', () => {
        expect(FluentArrayDefinition.create(['foo', 'bar']).get(1).toUpperCase()).toBe('BAR');
        expect(FluentArrayDefinition.create([-42, 42]).get(1).toFixed(2)).toBe('42.00');
    });

    it('can be subclassed', () => {
        class SuperFluentArray<T extends { toString(): string }> extends FluentArrayDefinition<T> {

            // TODO avoid doing this
            public static create: <T>(value?: T[]) => FluentArrayInstance<SuperFluentArray<T>, T>;

            public slice(): this {
                return this.create(this.value.reverse());
            }

            public sortAlphabetically(): this {
                return this.create(this.value.slice(0).sort((a, b) => a.toString() > b.toString() ? 1 : -1));
            }

        }
        const superFluentArray = SuperFluentArray.create(['foo', 'bar']);

        expect(superFluentArray).toBeInstanceOf(SuperFluentArray);
        expect(superFluentArray.slice().toArray()).toEqual(['bar', 'foo']);
        expect(superFluentArray.sortAlphabetically().toArray()).toEqual(['bar', 'foo']);
    });

    it.todo('can use index syntax');
    it.todo('can iterate over items');

});
