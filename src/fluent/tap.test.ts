import { after } from '@/helpers/index';
import { tap } from './tap';

describe('tap', () => {

    it('taps using callbacks', () => {
        expect(tap({ foo: 'foo' }, o => o.foo += 'bar').foo).toBe('foobar');
    });

    it('taps using asynchronous callbacks', async () => {
        const calls = [];

        await tap(null, async () => {
            await after();

            calls.push(1);
        });

        calls.push(2);

        expect(calls).toEqual([1, 2]);
    });

    it('taps using proxy', () => {
        // Arrange
        class Computer {

            theMeaningOfLife = 42;

            public getTheMeaningOfLife(): number {
                return this.theMeaningOfLife;
            }

        }

        const computer = new Computer();

        // Act
        const tappedComputer = tap(computer);

        // Assert
        expect(tappedComputer.theMeaningOfLife).toBe(42);
        expect(tappedComputer.getTheMeaningOfLife()).toBe(tappedComputer);
    });

});
