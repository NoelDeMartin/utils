import { tt } from '@/testing/index';
import type { Equals, Expect } from '@/testing/index';

import FluentArrayDefinition from './FluentArray';
import type { FluentArray, FluentArrayInstance } from './FluentArray';

describe('FluentArray', () => {

    it('delegates to helper methods', () => {
        const fluentArray = FluentArrayDefinition.create(['foo', 'bar']);

        expect(fluentArray.withoutIndexes([1]).toArray()).toEqual(['foo']);
        expect(fluentArray.withoutIndexes([0]).toArray()).toEqual(['bar']);
        expect(fluentArray.withoutIndexes([]).toArray()).toEqual(['foo', 'bar']);
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
        expect(fluentArray.concat(['baz']).remove('baz')).toBe(true);
        expect(fluentArray.flatMap(() => [42, 42, 23]).unique().toArray()).toEqual([42, 23]);
        expect(fluentArray.diff(['foo', 'baz'])).toEqual({ added: ['baz'], removed: ['bar'] });
    });

    it('extends primitive methods', () => {
        const fluentArray = FluentArrayDefinition.create(['foo', 'bar', null]);

        expect(fluentArray.filter().toArray()).toEqual(['foo', 'bar']);
        expect(fluentArray.filter(item => !!item).toArray()).toEqual(['foo', 'bar']);
    });

    it('infers item types', () => {
        expect(FluentArrayDefinition.create(['foo', 'bar']).get(1).toUpperCase()).toBe('BAR');
        expect(FluentArrayDefinition.create([-42, 42]).get(1).toFixed(2)).toBe('42.00');
    });

    it('can be subclassed', () => {
        class SuperFluentArray<T extends { toString(): string }> extends FluentArrayDefinition<T> {

            // TODO avoid doing this
            declare public static create: <T>(value?: T[]) => FluentArrayInstance<SuperFluentArray<T>, T>;

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

    it('can iterate over items', () => {
        let counter = 0;
        const items = ['foo', 'bar', 'baz'];
        const fluentArray = FluentArrayDefinition.create(items);

        for (const item of fluentArray) {
            expect(item).toEqual(items[counter++]);
        }
    });

    it.todo('can use index syntax');
    it.todo('overrides primitive methods (use arrayFilter helper instead of primitive)');

});

type User = { name: string; age: number };
const fluentStringsArray = FluentArrayDefinition.create(['foo']);
const fluentNumbersArray = FluentArrayDefinition.create([42]);
const fluentUsersArray = FluentArrayDefinition.create([{ name: 'John', age: 42 } as User]);
const flatStringsArray = fluentNumbersArray.flatMap((item: number) => ['foo' + item]);
const filteredStringsArray = FluentArrayDefinition.create(['foo', null]).filter();
const names = fluentUsersArray.project('name');
const ages = fluentUsersArray.project('age');

describe('FluentArray types', () => {

    it('has correct types', tt<
        Expect<Equals<typeof fluentStringsArray.slice, (s?: number, e?: number) => FluentArray<string>>> |
        Expect<Equals<typeof fluentNumbersArray.slice, (s?: number, e?: number) => FluentArray<number>>> |
        Expect<Equals<typeof fluentStringsArray.remove, (i: string) => boolean>> |
        Expect<Equals<typeof fluentNumbersArray.remove, (i: number) => boolean>> |
        Expect<Equals<typeof flatStringsArray, FluentArray<string>>> |
        Expect<Equals<typeof filteredStringsArray, FluentArray<string>>> |
        Expect<Equals<typeof names, string[]>> |
        Expect<Equals<typeof ages, number[]>> |
        true
    >());

});
