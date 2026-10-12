import { describe, expect, expectTypeOf, it, vi } from 'vite-plus/test';

import { isFacade } from './facade';
import { isLazyFacade, lazyFacade } from './lazyFacade';

class CounterService {
    public count: number = 0;

    public add(amount: number = 1): number {
        return (this.count += amount);
    }
}

describe('Lazy Facades', () => {
    it('defers creating instances until methods are called', async () => {
        // Arrange
        const factory = vi.fn(async () => new CounterService());
        const counter = lazyFacade(factory);

        expect(factory).not.toHaveBeenCalled();

        // Act
        const count = await counter.add(2);

        // Assert
        expect(count).toEqual(2);
        expect(factory).toHaveBeenCalledOnce();
        expectTypeOf(counter.add).returns.toEqualTypeOf<Promise<number>>();
    });

    it('supports classes', async () => {
        // Arrange
        const counter = lazyFacade(CounterService);

        // Act
        await counter.add();
        await counter.add();

        // Assert
        await expect(counter.getProperty('count')).resolves.toEqual(2);
    });

    it('creates instances only once', async () => {
        // Arrange
        const factory = vi.fn(async () => new CounterService());
        const counter = lazyFacade(factory);

        // Act
        await Promise.all([counter.add(), counter.add(), counter.add()]);

        // Assert
        expect(factory).toHaveBeenCalledOnce();
        await expect(counter.getProperty('count')).resolves.toEqual(3);
    });

    it('swaps instances', async () => {
        // Arrange
        const factory = vi.fn(async () => new CounterService());
        const counter = lazyFacade(factory);
        const mock = new CounterService();

        // Act
        counter.setInstance(mock);

        await counter.add(5);

        // Assert
        expect(factory).not.toHaveBeenCalled();
        expect(mock.count).toEqual(5);
    });

    it('swaps instances while loading', async () => {
        // Arrange
        const { promise, resolve } = Promise.withResolvers<CounterService>();
        const factory = vi.fn(() => promise);
        const counter = lazyFacade(factory);
        const mock = new CounterService();
        const pendingCall = counter.add();

        await vi.waitFor(() => expect(factory).toHaveBeenCalled());

        // Act
        counter.setInstance(mock);
        resolve(new CounterService());

        await pendingCall;

        // Assert
        expect(mock.count).toEqual(1);
        await expect(counter.getInstance()).resolves.toBe(mock);
    });

    it('swaps instances while loading fails', async () => {
        // Arrange
        const { promise, reject } = Promise.withResolvers<CounterService>();
        const factory = vi.fn(() => promise);
        const counter = lazyFacade(factory);
        const mock = new CounterService();
        const pendingCall = counter.add();

        await vi.waitFor(() => expect(factory).toHaveBeenCalled());

        // Act
        counter.setInstance(mock);
        reject(new Error('Network error'));

        // Assert
        await expect(pendingCall).resolves.toEqual(1);
        expect(mock.count).toEqual(1);
    });

    it('resets instances', async () => {
        // Arrange
        const counter = lazyFacade(CounterService);

        await counter.add(3);

        // Act
        counter.reset();

        // Assert
        await expect(counter.getProperty('count')).resolves.toEqual(0);
    });

    it('retries failed factories', async () => {
        // Arrange
        const factory = vi
            .fn<() => Promise<CounterService>>()
            .mockRejectedValueOnce(new Error('Network error'))
            .mockResolvedValue(new CounterService());
        const counter = lazyFacade(factory);

        // Act
        const failedCall = counter.add();
        const retriedCall = failedCall.catch(() => counter.add());

        // Assert
        await expect(failedCall).rejects.toThrow('Network error');
        await expect(retriedCall).resolves.toEqual(1);
        expect(factory).toHaveBeenCalledTimes(2);
    });

    it('throws factory errors', async () => {
        // Arrange
        const counter = lazyFacade<CounterService>(() => {
            throw new Error('Factory error');
        });

        // Act & Assert
        await expect(counter.add()).rejects.toThrow('Factory error');
    });

    it('can be resolved by promises', async () => {
        // Arrange
        const counter = lazyFacade(CounterService);

        // Act
        const resolved = Promise.resolve(counter);

        // Assert
        await expect(resolved).resolves.toBe(counter);
    });

    it('rejects calling properties and setting values', async () => {
        // Arrange
        const counter = lazyFacade(CounterService);

        // Act & Assert
        await expect((counter as unknown as { count(): void }).count()).rejects.toThrow('is not a function');
        expect(() => ((counter as unknown as { count: number }).count = 3)).toThrow("Can't set 'count'");
    });

    it('ignores symbol properties', () => {
        // Arrange
        const factory = vi.fn(async () => new CounterService());
        const counter = lazyFacade(factory);

        // Assert
        expect((counter as unknown as Record<symbol, unknown>)[Symbol.toPrimitive]).toBeUndefined();
        expect(factory).not.toHaveBeenCalled();
    });

    it('is not confused with eager facades', () => {
        // Arrange
        const counter = lazyFacade(CounterService);

        // Assert
        expect(isLazyFacade(counter)).toBe(true);
        expect(isFacade(counter)).toBe(false);
    });
});
