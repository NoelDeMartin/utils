import { describe, expect, it } from 'vitest';

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

});
