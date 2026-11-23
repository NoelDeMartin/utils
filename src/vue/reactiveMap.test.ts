import { describe, expect, it } from 'vite-plus/test';
import { nextTick, watchEffect } from 'vue';

import { reactiveMap } from './reactiveMap';

describe('Vue reactiveMap', () => {
    it('watches updates', async () => {
        // Arrange
        const map = reactiveMap();
        let updates = 0;

        watchEffect(() => (map.has('foo'), updates++));

        // Act
        map.add('foo');
        await nextTick();

        map.add('bar');
        await nextTick();

        map.add('baz');
        await nextTick();

        map.reset();
        await nextTick();

        // Assert
        expect(updates).toEqual(5);
    });

    it('notifies synchronous watchers after updating', () => {
        // Arrange
        const map = reactiveMap();
        const seen: boolean[] = [];

        watchEffect(() => seen.push(map.has('foo')), { flush: 'sync' });

        // Act
        map.add('foo');
        map.delete('foo');
        map.reset(['foo']);
        map.clear();

        // Assert
        expect(seen).toEqual([false, true, false, true, false]);
    });

    it('notifies watchers when adding existing items', async () => {
        // Arrange
        const map = reactiveMap(['foo']);
        let updates = 0;

        watchEffect(() => (map.values(), updates++));

        // Act
        map.add('foo');
        await nextTick();

        // Assert
        expect(updates).toEqual(2);
    });

    it('replaces items by key', async () => {
        // Arrange
        const map = reactiveMap<{ id: string; name: string }>(undefined, { key: (item) => item.id });
        const alice = { id: 'alice', name: 'Alice' };
        const otherAlice = { id: 'alice', name: 'Alice (other instance)' };
        const bob = { id: 'bob', name: 'Bob' };
        const charlie = { id: 'charlie', name: 'Charlie' };
        let updates = 0;

        map.add(alice);
        map.add(bob);
        watchEffect(() => (map.values(), updates++));

        // Act
        map.replace(otherAlice);
        await nextTick();

        map.replace(charlie);
        await nextTick();

        // Assert
        expect(map.values()).toEqual([otherAlice, bob, charlie]);
        expect(updates).toEqual(3);
    });

    it('gets items by key', async () => {
        // Arrange
        const map = reactiveMap<{ id: string; name: string }, string>(undefined, { key: (item) => item.id });
        const alice = { id: 'alice', name: 'Alice' };
        const otherAlice = { id: 'alice', name: 'Alice (other instance)' };
        const seen: (string | undefined)[] = [];

        map.add(alice);
        watchEffect(() => seen.push(map.get('alice')?.name));

        // Act
        map.replace(otherAlice);
        await nextTick();

        // Assert
        expect(map.get('alice')).toBe(otherAlice);
        expect(map.get('bob')).toBeUndefined();
        expect(seen).toEqual(['Alice', 'Alice (other instance)']);
    });

    it('uses properties as keys', () => {
        // Arrange
        const alice = { id: 'alice', age: 42 };
        const bob = { id: 'bob', age: 23 };

        // Act
        const map = reactiveMap<{ id: string; age: number }, string>(new Set([alice, bob]).values(), { key: 'id' });

        // @ts-expect-error age is not a string
        reactiveMap<{ id: string; age: number }, string>([], { key: 'age' });

        // Assert
        expect(map.get('bob')).toBe(bob);
        expect(map.values()).toEqual([alice, bob]);
    });

    it('compares items by key', () => {
        // Arrange
        const map = reactiveMap<{ id: string; name: string }>(undefined, { key: (item) => item.id });
        const alice = { id: 'alice', name: 'Alice' };
        const otherAlice = { id: 'alice', name: 'Alice (other instance)' };
        const bob = { id: 'bob', name: 'Bob' };

        // Act
        map.add(alice);
        map.add(otherAlice);
        map.add(bob);
        map.delete({ ...bob });

        // Assert
        expect(map.values()).toEqual([alice]);
        expect(map.has(otherAlice)).toBe(true);
        expect(map.has(bob)).toBe(false);
    });
});
