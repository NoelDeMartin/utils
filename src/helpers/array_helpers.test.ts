import { describe, expect, it } from 'vitest';
import { tt } from '@noeldemartin/testing';
import type { Expect } from '@noeldemartin/testing';

import { toString } from '@noeldemartin/utils/helpers/object_helpers';
import type { DeepKeyOf, Equals } from '@noeldemartin/utils/types';

import type { ArraySortDirection, ArraySortFieldDirection } from './array_helpers';
import {
    arrayDiff,
    arrayEquals,
    arrayFilter,
    arrayFirst,
    arrayFrom,
    arrayGroupBy,
    arrayProject,
    arrayRandomItem,
    arrayRemove,
    arrayReplace,
    arraySorted,
    arrayUnique,
    arrayWhere,
    arrayWithout,
    arrayWithoutIndexes,
    arrayZip,
    reduceBy,
} from './array_helpers';

describe('Array helpers', () => {

    it('compares arrays', () => {
        expect(arrayEquals(['one'], ['one'])).toBe(true);
        expect(arrayEquals(['one'], ['one', 'two'])).toBe(false);
        expect(arrayEquals(['one', 'two'], ['two', 'one'])).toBe(false);
    });

    it('diffs arrays', () => {
        expect(arrayDiff([], [])).toEqual({ added: [], removed: [] });
        expect(arrayDiff(['foo', 'bar'], ['foo', 'baz'])).toEqual({ added: ['baz'], removed: ['bar'] });
        expect(arrayDiff(['foo', 'bar'], ['bar', 'foo', 'bar'])).toEqual({ added: ['bar'], removed: [] });
    });

    it('diffs arrays using custom search function', () => {
        const compareIds = (a: { id: number }, b: { id: number }) => a.id === b.id;
        const item = (id: number) => ({ id });

        expect(arrayDiff([item(0), item(42)], [item(42), item(23)], compareIds)).toEqual({
            added: [item(23)],
            removed: [item(0)],
        });
    });

    it('finds item matching filter', () => {
        expect(arrayFirst([0, 10, 42], (n) => n > 10)).toBe(42);
        expect(arrayFirst([0, 10, 42], (n) => n > 100)).toBeNull();
    });

    it('gets random items', () => {
        expect(arrayRandomItem([])).toBeNull();
        expect(arrayRandomItem([42])).toBe(42);
        expect([23, 42].includes(arrayRandomItem([23, 42]) as number)).toBe(true);
    });

    it('removes items', () => {
        const items = ['foo', 'bar'];

        expect(arrayRemove(items, 'bar')).toBe(true);
        expect(arrayRemove(items, 'bar')).toBe(false);
        expect(items).toEqual(['foo']);
    });

    it('replaces items', () => {
        // Arrange
        const items = ['foo', 'bar', 'baz'];

        // Act
        const result = arrayReplace(items, 'bar', 'qux');

        // Assert
        expect(result).toBe(true);
        expect(items).toEqual(['foo', 'qux', 'baz']);
    });

    it('gets unique items', () => {
        const items = ['foo', 'bar', 'baz', 'foo', 'bar'];

        expect(arrayUnique(items)).toEqual(['foo', 'bar', 'baz']);
        expect(items).toEqual(['foo', 'bar', 'baz', 'foo', 'bar']);
        expect(arrayUnique([4, 1, 2, 1, 3, 4, 2])).toEqual([4, 1, 2, 3]);
        expect(arrayUnique([4, 1, 2, 1, 3, 4, 2], (n) => toString(n % 2))).toEqual([4, 1]);
    });

    it('sorts items', () => {
        expect(arraySorted([1, 3, 2])).toEqual([1, 2, 3]);
        expect(arraySorted([1, 3, 2], 'asc')).toEqual([1, 2, 3]);
        expect(arraySorted([1, 3, 2], 'desc')).toEqual([3, 2, 1]);
    });

    it('sorts items by field', () => {
        const items = [
            { name: 'Son Goku' },
            { name: 'Astroboy' },
            { name: 'Guts' },
            { name: 'Griffith' },
            { name: 'Zetman' },
        ];

        const expectSorted = (field: DeepKeyOf<(typeof items)[number]>, direction?: ArraySortDirection) => {
            return expect(arraySorted(items, field, direction).map(({ name }) => name));
        };

        expectSorted('name').toEqual(['Astroboy', 'Griffith', 'Guts', 'Son Goku', 'Zetman']);
        expectSorted('name', 'asc').toEqual(['Astroboy', 'Griffith', 'Guts', 'Son Goku', 'Zetman']);
        expectSorted('name', 'desc').toEqual(['Zetman', 'Son Goku', 'Guts', 'Griffith', 'Astroboy']);
    });

    it('sorts items by nested field', () => {
        const items = [
            { author: { name: 'Brandom Sanderson' } },
            { author: { name: 'Arthur Conan Doyle' } },
            { author: { name: 'J.R.R. Tolkien' } },
        ];

        const expectSorted = (field: DeepKeyOf<(typeof items)[number]>, direction?: ArraySortDirection) => {
            return expect(arraySorted(items, field, direction).map(({ author }) => author.name));
        };

        expectSorted('author.name').toEqual(['Arthur Conan Doyle', 'Brandom Sanderson', 'J.R.R. Tolkien']);
        expectSorted('author.name', 'desc').toEqual(['J.R.R. Tolkien', 'Brandom Sanderson', 'Arthur Conan Doyle']);
    });

    it('sorts items by field with undefined value', () => {
        const items = [{ completed: true }, { completed: undefined }, { completed: true }];

        expect(arraySorted(items, 'completed').map((item) => item.completed)).toEqual([undefined, true, true]);
        expect(arraySorted(items, 'completed', 'asc').map((item) => item.completed)).toEqual([undefined, true, true]);
        expect(arraySorted(items, 'completed', 'desc').map((item) => item.completed)).toEqual([true, true, undefined]);
    });

    it('sorts items by multiple fields', () => {
        const items = [
            { name: 'Son Goku', age: 31 },
            { name: 'Son Goku', age: 11 },
            { name: 'Astroboy', age: 18 },
            { name: 'Zetman', age: 16 },
        ];

        const expectSorted = (fields: DeepKeyOf<(typeof items)[number]>[], direction?: ArraySortDirection) => {
            return expect(arraySorted(items, fields, direction).map(({ name, age }) => `${name}:${age}`));
        };

        expectSorted(['name']).toEqual(['Astroboy:18', 'Son Goku:31', 'Son Goku:11', 'Zetman:16']);
        expectSorted(['name'], 'desc').toEqual(['Zetman:16', 'Son Goku:31', 'Son Goku:11', 'Astroboy:18']);
        expectSorted(['name', 'age']).toEqual(['Astroboy:18', 'Son Goku:11', 'Son Goku:31', 'Zetman:16']);
        expectSorted(['name', 'age'], 'desc').toEqual(['Zetman:16', 'Son Goku:31', 'Son Goku:11', 'Astroboy:18']);
        expectSorted(['age']).toEqual(['Son Goku:11', 'Zetman:16', 'Astroboy:18', 'Son Goku:31']);
    });

    it('sorts items by multiple fields and directions', () => {
        const items = [
            { title: 'Happy', score: 7 },
            { title: 'Monster', score: 10 },
            { title: 'Pluto', score: 9 },
            { title: 'Billy Bat', score: 9 },
            { title: 'Billy Bat', score: 8 },
        ];

        const expectSorted = (fields: ArraySortFieldDirection<(typeof items)[number]>[]) => {
            return expect(arraySorted(items, fields).map(({ title, score }) => `${title}:${score}`));
        };

        expectSorted([
            ['title', 'asc'],
            ['score', 'desc'],
        ]).toEqual(['Billy Bat:9', 'Billy Bat:8', 'Happy:7', 'Monster:10', 'Pluto:9']);

        expectSorted([
            ['score', 'desc'],
            ['title', 'asc'],
        ]).toEqual(['Monster:10', 'Billy Bat:9', 'Pluto:9', 'Billy Bat:8', 'Happy:7']);
    });

    it('groups items', () => {
        const pirates = [
            { name: 'Monkey D. Luffy', band: 'mugiwara' },
            { name: 'Roronoa Zoro', band: 'mugiwara' },
            { name: 'Nami', band: 'mugiwara' },
            { name: 'Marshall D. Teach', band: 'blackbeard' },
            { name: 'Jesus Burgess', band: 'blackbeard' },
            { name: 'Shiryu', band: 'blackbeard' },
        ];

        expect(arrayGroupBy(pirates, 'band')).toEqual({
            mugiwara: [
                { name: 'Monkey D. Luffy', band: 'mugiwara' },
                { name: 'Roronoa Zoro', band: 'mugiwara' },
                { name: 'Nami', band: 'mugiwara' },
            ],
            blackbeard: [
                { name: 'Marshall D. Teach', band: 'blackbeard' },
                { name: 'Jesus Burgess', band: 'blackbeard' },
                { name: 'Shiryu', band: 'blackbeard' },
            ],
        });

        expect(arrayGroupBy(pirates, (pirate) => (pirate.band === 'mugiwara' ? 'good' : 'bad'))).toEqual({
            good: [
                { name: 'Monkey D. Luffy', band: 'mugiwara' },
                { name: 'Roronoa Zoro', band: 'mugiwara' },
                { name: 'Nami', band: 'mugiwara' },
            ],
            bad: [
                { name: 'Marshall D. Teach', band: 'blackbeard' },
                { name: 'Jesus Burgess', band: 'blackbeard' },
                { name: 'Shiryu', band: 'blackbeard' },
            ],
        });
    });

    it('gets items without specified items', () => {
        const items = ['foo', 'bar', 'baz'];

        expect(arrayWithout(items, 'bar')).toEqual(['foo', 'baz']);
        expect(arrayWithout(items, ['bar'])).toEqual(['foo', 'baz']);
        expect(arrayWithout(items, ['foo', 'baz'])).toEqual(['bar']);
        expect(items).toEqual(['foo', 'bar', 'baz']);
    });

    it('gets items without specified indexes', () => {
        const items = ['foo', 'bar', 'baz'];

        expect(arrayWithoutIndexes(items, [1])).toEqual(['foo', 'baz']);
        expect(arrayWithoutIndexes(items, [0, 2])).toEqual(['bar']);
        expect(items).toEqual(['foo', 'bar', 'baz']);
    });

    it('projects properties', () => {
        // Arrange.
        class User {

            constructor(public role: string) {}

            public isAdmin(): boolean {
                return this.role === 'admin';
            }
        
        }

        const admin = new User('admin');
        const guest = new User('guest');

        // Act & Assert
        expect(arrayProject([admin, guest], 'role')).toEqual(['admin', 'guest']);
    });

    it('filters by methods and values', () => {
        // Arrange.
        class User {

            constructor(public role: string) {}

            public isAdmin(): boolean {
                return this.role === 'admin';
            }
        
        }

        const admin = new User('admin');
        const guest = new User('guest');

        // Act & Assert
        expect(arrayWhere([admin, guest], 'isAdmin')).toEqual([admin]);
        expect(arrayWhere([admin, guest], 'role', 'guest')).toEqual([guest]);
    });

    it('zips arrays', () => {
        expect(arrayZip([1, 2, 3], [4, 5, 6])).toEqual([
            [1, 4],
            [2, 5],
            [3, 6],
        ]);
    });

    it('creates arrays from values', () => {
        class MyString extends String {}

        expect(arrayFrom('foobar')).toEqual(['foobar']);
        expect(arrayFrom(new String('foobar'))).toEqual([new String('foobar')]);
        expect(arrayFrom(new MyString('foobar'))).toEqual([new MyString('foobar')]);
        expect(arrayFrom(['foo', 'bar'])).toEqual(['foo', 'bar']);
        expect(arrayFrom(new Set(['foo', 'bar']))).toEqual(['foo', 'bar']);
        expect(arrayFrom(null)).toEqual([null]);
        expect(arrayFrom(null, { ignoreEmptyValues: true })).toEqual([]);
    });

    it('reduces by key', () => {
        const items = [
            { id: '1', name: 'Alice' },
            { id: '2', name: 'Bob' },
        ];

        const result = reduceBy(items, 'id');

        expect(result).toEqual({
            1: { id: '1', name: 'Alice' },
            2: { id: '2', name: 'Bob' },
        });
    });

    it('reduces by key with projection', () => {
        const items = [
            { id: '1', name: 'Alice' },
            { id: '2', name: 'Bob' },
        ];

        const result = reduceBy(items, 'id', (item) => item.name);

        expect(result).toEqual({
            1: 'Alice',
            2: 'Bob',
        });
    });

});

let enabled: boolean | undefined;
const sorting: { field: 'id'; direction: ArraySortDirection }[] = [];
const filteredItems = arrayFilter(['foo' as string, null, 'bar', undefined]);
const filteredConditionalItems = arrayFilter(['foo' as string, null, enabled && 'bar', undefined]);
const filteredConstItems = arrayFilter(['foo' as const, null, enabled && 'bar', undefined]);
const arrayFromNumber = arrayFrom(42);
const arrayFromSet = arrayFrom(new Set(['foo']));
const arrayFromArray = arrayFrom([new Date()]);
const arrayFromConditional = arrayFrom(Date.now() ? 42 : [42]);
const groupedByKey = arrayGroupBy([{ id: 'Foo Bar' }], 'id');
const groupedByFunction = arrayGroupBy([{ id: 'Foo Bar' }], (item) => (item.id ? 'one' : 'two'));
const sortedItems = arraySorted([{ id: 'Foo Bar' }], [['id', 'asc']]);
const sortedItemsReadonly = arraySorted(
    [{ id: 'Foo Bar' }],
    sorting.map(({ field, direction }) => [field, direction] as const),
);

describe('Array helpers types', () => {

    it(
        'has correct types',
        tt<
            | Expect<Equals<typeof filteredItems, string[]>>
            | Expect<Equals<typeof filteredConditionalItems, string[]>>
            | Expect<Equals<typeof filteredConstItems, ('foo' | 'bar')[]>>
            | Expect<Equals<typeof arrayFromNumber, number[]>>
            | Expect<Equals<typeof arrayFromSet, string[]>>
            | Expect<Equals<typeof arrayFromArray, Date[]>>
            | Expect<Equals<typeof arrayFromConditional, number[]>>
            | Expect<Equals<keyof typeof groupedByKey, string>>
            | Expect<Equals<keyof typeof groupedByFunction, 'one' | 'two'>>
            | Expect<Equals<typeof sortedItems, { id: string }[]>>
            | Expect<Equals<typeof sortedItemsReadonly, { id: string }[]>>
            | true
        >(),
    );

});
