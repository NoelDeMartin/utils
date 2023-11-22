import { after } from '@/helpers/time_helpers';
import { noop } from '@/fluent/noop';
import { tt } from '@/testing/index';
import type { Equals, Expect } from '@/testing/index';

import { tap } from './tap';

describe('tap helper', () => {

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

            public theMeaningOfLife = 42;

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


const numberResult = tap(42, noop);
const stringResult = tap('42', noop);
const promisedNumberResult = tap(42, () => Promise.resolve());

describe('tap helper types', () => {

    it('has correct types', tt<
        Expect<Equals<typeof numberResult, 42>> |
        Expect<Equals<typeof stringResult, '42'>> |
        Expect<Equals<typeof promisedNumberResult, Promise<number>>> |
        true
    >());

});
