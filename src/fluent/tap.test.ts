import { tap } from './tap';

describe('tap', () => {

    it('taps using callbacks', () => {
        expect(tap({foo: 'foo'}, o => o.foo += 'bar').foo).toBe('foobar');
    });

    it('taps using proxy', () => {
        // Arrange
        class Computer {
            public getTheMeaningOfLife(): number {
                return 42;
            }
        }

        const computer = new Computer();

        // Act
        const tappedComputer = tap(computer);

        // Assert
        expect(tappedComputer.getTheMeaningOfLife()).toBe(tappedComputer);
    });

});
