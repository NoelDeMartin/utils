import PromisedValue from './PromisedValue';

describe('PromisedValue', () => {

    it('works like a promise', async () => {
        const promisedString = new PromisedValue<string>();
        expect(promisedString.value).toBe(null);
        expect(promisedString.isResolved()).toBe(false);

        promisedString.resolve('foo');
        expect(promisedString.isResolved()).toBe(true);
        expect(promisedString.value).toBe('foo');
        expect(promisedString).resolves.toBe('foo');
    });

    it('can update values', () => {
        const promisedString = new PromisedValue<string>();
        promisedString.resolve('foo');
        promisedString.resolve('bar');

        expect(promisedString.isResolved()).toBe(true);
        expect(promisedString.value).toBe('bar');
        expect(promisedString).resolves.toBe('bar');
    });

});
