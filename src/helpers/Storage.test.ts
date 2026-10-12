import { beforeEach, describe, expect, it } from 'vite-plus/test';

import InMemoryStorageService from './InMemoryStorageService';
import Storage from './Storage';

describe('Storage', () => {
    let storage: InMemoryStorageService;

    beforeEach(() => {
        storage = new InMemoryStorageService();
        Storage.setInstance(storage);
    });

    it('uses custom storage backends', () => {
        // Act
        Storage.set('foo', { bar: 'baz' });

        // Assert
        expect(storage.items.get('foo')).toEqual('{"bar":"baz"}');
        expect(Storage.get('foo')).toEqual({ bar: 'baz' });
        expect(Storage.has('foo')).toBe(true);
        expect(Storage.get('missing', 'default')).toEqual('default');
        expect(() => Storage.require('missing')).toThrow("Failed getting required key from local storage: 'missing'");
    });

    it('stores undefined values', () => {
        // Act
        Storage.set('foo', undefined);

        // Assert
        expect(Storage.has('foo')).toBe(true);
        expect(Storage.get('foo', 'default')).toBeUndefined();
        expect(Storage.require('foo')).toBeUndefined();
    });

    it('pulls values', () => {
        // Arrange
        Storage.set('foo', 'bar');

        // Act
        const value = Storage.pull('foo');

        // Assert
        expect(value).toEqual('bar');
        expect(Storage.has('foo')).toBe(false);
    });
});
