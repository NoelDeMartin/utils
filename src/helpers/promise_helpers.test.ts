import { range } from '@noeldemartin/utils/helpers/array_helpers';
import { after } from '@noeldemartin/utils/helpers/time_helpers';
import { describe, expect, it } from 'vite-plus/test';

import { asyncFirst, coalesce, silenced } from './promise_helpers';

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

    it('coalesces operations requested while running', async () => {
        // Arrange
        let runs = 0;
        const resumes: (() => void)[] = [];
        const operation = coalesce(async () => {
            const run = ++runs;

            await new Promise<void>((resolve) => resumes.push(resolve));

            return run;
        });

        // Act
        const first = operation();
        const second = operation();
        const third = operation();

        resumes.shift()?.();
        await after({ milliseconds: 0 });
        resumes.shift()?.();

        const results = await Promise.all([first, second, third]);

        // Assert
        expect(runs).toEqual(2);
        expect(results).toEqual([1, 2, 2]);
    });

    it('runs coalesced operations again after they finish', async () => {
        // Arrange
        let runs = 0;
        const operation = coalesce(async () => ++runs);

        // Act
        const first = await operation();
        const second = await operation();

        // Assert
        expect([first, second]).toEqual([1, 2]);
    });

    it('does not overlap coalesced operations requested when they finish', async () => {
        // Arrange
        let active = 0;
        let maxActive = 0;
        const resumes: (() => void)[] = [];
        const operation = coalesce(async () => {
            maxActive = Math.max(maxActive, ++active);

            await new Promise<void>((resolve) => resumes.push(resolve));

            active--;
        });

        // Act
        const first = operation();
        const second = operation();
        const third = first.then(() => operation());

        resumes.shift()?.();
        await after({ milliseconds: 0 });
        resumes.shift()?.();
        await after({ milliseconds: 0 });
        resumes.shift()?.();

        await Promise.all([first, second, third]);

        // Assert
        expect(maxActive).toEqual(1);
    });

    it('runs queued coalesced operations after failures', async () => {
        // Arrange
        let runs = 0;
        let fail!: (error: Error) => void;
        const operation = coalesce(async () => {
            if (++runs === 1) {
                await new Promise<void>((_, reject) => (fail = reject));
            }

            return runs;
        });

        // Act
        const first = operation();
        const second = operation();

        fail(new Error('foobar'));

        // Assert
        await expect(first).rejects.toThrow('foobar');
        await expect(second).resolves.toEqual(2);
    });

    it('rejects coalesced operations that throw synchronously', async () => {
        // Arrange
        const operation = coalesce((): Promise<void> => {
            throw new Error('foobar');
        });

        // Act
        const result = operation();

        // Assert
        await expect(result).rejects.toThrow('foobar');
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
