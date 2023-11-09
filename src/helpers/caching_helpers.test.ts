import { asyncMemo, once, setAsyncMemo } from './caching_helpers';

describe('Cache helpers', () => {

    it('caches async results', async () => {
        // Arrange
        let calls = 0;
        const key = 'store';
        const result = 42;
        const operation = () => (calls++, Promise.resolve(result));

        // Act
        const results = await Promise.all([
            asyncMemo(key, operation),
            asyncMemo(key, operation),
            asyncMemo(key, operation),
        ]);

        // Assert
        expect(calls).toBe(1);

        results.forEach(actualResult => expect(actualResult).toEqual(result));
    });

    it('sets cached async results', async () => {
        // Arrange
        let calls = 0;
        const key = 'store';
        const lazyResult = 42;
        const eagerResult = 23;
        const operation = () => (calls++, Promise.resolve(lazyResult));

        // Act
        setAsyncMemo(key, eagerResult);

        const results = await Promise.all([
            asyncMemo(key, operation),
            asyncMemo(key, operation),
            asyncMemo(key, operation),
        ]);

        // Assert
        expect(calls).toBe(0);

        results.forEach(actualResult => expect(actualResult).toEqual(eagerResult));
    });

    it('caches results using once', () => {
        // Arrange.
        let count = 0;
        const counter = () => count++;
        const cachedCounter = once(counter);

        // Act.
        cachedCounter();
        cachedCounter();
        cachedCounter();

        // Assert.
        expect(count).toEqual(1);
    });

});
