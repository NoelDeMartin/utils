import { tt } from '@/testing/index';
import { toString } from '@/helpers/object_helpers';
import type { Equals, Expect } from '@/testing/index';

import {
    arrayDiff,
    arrayFilter,
    arrayFirst,
    arrayFrom,
    arrayProject,
    arrayRemove,
    arrayReplace,
    arraySorted,
    arrayUnique,
    arrayWhere,
    arrayWithoutIndexes,
    arrayZip,
} from './array_helpers';

describe('Array helpers', () => {

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
        expect(arrayFirst([0, 10, 42], n => n > 10)).toBe(42);
        expect(arrayFirst([0, 10, 42], n => n > 100)).toBeNull();
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
        expect(arrayUnique([4,1,2,1,3,4,2])).toEqual([4,1,2,3]);
        expect(arrayUnique([4,1,2,1,3,4,2], n => toString(n % 2))).toEqual([4,1]);
    });

    it('sorts by field', () => {
        const items = [{ name: 'Son Goku' }, { name: 'Astroboy' }, { name: 'Zetman' }];

        expect(arraySorted(items, 'name').map(item => item.name)).toEqual(['Astroboy', 'Son Goku', 'Zetman']);
        expect(arraySorted(items, 'name', 'asc').map(item => item.name)).toEqual(['Astroboy', 'Son Goku', 'Zetman']);
        expect(arraySorted(items, 'name', 'desc').map(item => item.name)).toEqual(['Zetman', 'Son Goku', 'Astroboy']);
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
        expect(arrayZip([1, 2, 3], [4, 5, 6])).toEqual([[1, 4], [2, 5], [3, 6]]);
    });

    it('creates arrays from values', () => {
        class MyString extends String {}

        expect(arrayFrom('foobar')).toEqual(['foobar']);
        expect(arrayFrom(new String('foobar'))).toEqual([new String('foobar')]);
        expect(arrayFrom(new MyString('foobar'))).toEqual([new MyString('foobar')]);
        expect(arrayFrom(['foo', 'bar'])).toEqual(['foo', 'bar']);
        expect(arrayFrom(new Set(['foo', 'bar']))).toEqual(['foo', 'bar']);
        expect(arrayFrom(null)).toEqual([null]);
    });

});

const filteredItems = arrayFilter(['foo', null, 'bar', undefined]);
const arrayFromNumber = arrayFrom(42);
const arrayFromSet = arrayFrom(new Set(['foo']));
const arrayFromArray = arrayFrom([new Date()]);

describe('Array helpers types', () => {

    it('has correct types', tt<
        Expect<Equals<typeof filteredItems, string[]>> |
        Expect<Equals<typeof arrayFromNumber, number[]>> |
        Expect<Equals<typeof arrayFromSet, string[]>> |
        Expect<Equals<typeof arrayFromArray, Date[]>> |
        true
    >());

});
