import { range } from '@noeldemartin/utils/helpers/array_helpers';
import { describe, expect, it } from 'vite-plus/test';

import { asyncFirst, silenced } from './promise_helpers';

class StubError extends Error {}

describe('Promise helpers', () => {
    it('gets first async result', async () => {
        // Arrange
        let calls = 0;
        const operation = (value: number) => (calls++, Promise.resolve(value >= 3 && value));

        // Act
        const result = await asyncFirst(range(9), operation);

        // Assert
        expect(calls).toEqual(4);
        expect(result).toEqual(3);
    });

    it('silences promises', async () => {
        // Arrange
        const promise = Promise.reject(new Error('foobar'));

        // Act
        const result = await silenced(promise);

        // Assert
        expect(result).toBeNull();
    });

    it('silences operations with default values', async () => {
        // Arrange
        const operation = silenced(
            async (value: number): Promise<number> => {
                throw new StubError(`Failed with ${value}`);
            },
            { default: 42 },
        );

        // Act
        const result = await operation(1);

        // Assert
        expect(result).toEqual(42);
    });

    it('silences only the given errors', async () => {
        // Arrange
        const operation = silenced(async (error: Error) => Promise.reject(error), { ignore: [StubError] });

        // Act & Assert
        await expect(operation(new StubError())).resolves.toBeNull();
        await expect(operation(new Error('foobar'))).rejects.toThrow('foobar');
        await expect(silenced(Promise.reject(new StubError()), { ignore: StubError })).resolves.toBeNull();
    });
});
