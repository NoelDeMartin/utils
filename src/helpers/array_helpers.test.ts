import { tt } from '@/testing/index';
import type { Equals, Expect } from '@/testing/index';

import {
    arrayFilter,
    arrayFirst,
    arrayProject,
    arrayRemove,
    arrayUnique,
    arrayWhere,
    arrayWithoutIndexes,
} from './array_helpers';

describe('Array helpers', () => {

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

    it('gets unique items', () => {
        const items = ['foo', 'bar', 'baz', 'foo', 'bar'];

        expect(arrayUnique(items)).toEqual(['foo', 'bar', 'baz']);
        expect(items).toEqual(['foo', 'bar', 'baz', 'foo', 'bar']);
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

});

const filteredItems = arrayFilter(['foo', null, 'bar', undefined]);

describe('Array helpers types', () => {

    it('has correct types', tt<Expect<Equals<typeof filteredItems, string[]>>>());

});
