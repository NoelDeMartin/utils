import { describe, expect, it } from 'vite-plus/test';

import PromisedValue from './PromisedValue';

describe('PromisedValue', () => {
    it('works like a promise', async () => {
        const promisedString = new PromisedValue<string>();
        expect(promisedString.value).toBe(null);
        expect(promisedString.isResolved()).toBe(false);

        promisedString.resolve('foo');
        expect(promisedString.isResolved()).toBe(true);
        expect(promisedString.value).toBe('foo');

        const resolvedValue = await promisedString;
        expect(resolvedValue).toBe('foo');
    });

    it('can update values', async () => {
        const promisedString = new PromisedValue<string>();
        promisedString.resolve('foo');
        promisedString.resolve('bar');

        expect(promisedString.isResolved()).toBe(true);
        expect(promisedString.value).toBe('bar');

        const resolvedValue = await promisedString;
        expect(resolvedValue).toBe('bar');
    });

    it('tracks settled status', async () => {
        const promisedString = new PromisedValue<string>();
        expect(promisedString.isSettled()).toBe(false);
        expect(promisedString.isRejected()).toBe(false);

        promisedString.reject(new Error('foo'));
        await expect(promisedString).rejects.toThrow('foo');
        expect(promisedString.isSettled()).toBe(true);
        expect(promisedString.isRejected()).toBe(true);
        expect(promisedString.isResolved()).toBe(false);

        promisedString.resolve('bar');
        expect(promisedString.isSettled()).toBe(true);
        expect(promisedString.isRejected()).toBe(false);
        expect(promisedString.isResolved()).toBe(true);
        await expect(promisedString).resolves.toBe('bar');

        promisedString.reset();
        expect(promisedString.isSettled()).toBe(false);
        expect(promisedString.isResolved()).toBe(false);
        expect(promisedString.value).toBeNull();
    });

    it('rejects with the latest reason', async () => {
        const promisedString = new PromisedValue<string>();

        promisedString.reject(new Error('foo'));
        await expect(promisedString).rejects.toThrow('foo');

        promisedString.reject(new Error('bar'));
        await expect(promisedString).rejects.toThrow('bar');
    });

    it('keeps falsy values', () => {
        const promisedNumber = new PromisedValue<number>();

        promisedNumber.resolve(0);

        expect(promisedNumber.value).toBe(0);
    });

    it('narrows resolved types', () => {
        const promisedUnknown = new PromisedValue<unknown>();
        const promisedString = new PromisedValue<string>();

        if (!promisedUnknown.isResolved()) {
            // This would fail type-checking if the type was narrowed to never.
            promisedUnknown.resolve('foo');
        }

        promisedString.resolve('bar');

        if (promisedString.isResolved()) {
            const value: string = promisedString.value;

            expect(value).toBe('bar');
        }

        expect(promisedUnknown.value).toBe('foo');
    });
});
