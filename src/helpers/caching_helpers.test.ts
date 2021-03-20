import { once } from './caching_helpers';

describe('Cache helpers', () => {

    it('caches results', () => {
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
