import { tt } from '@noeldemartin/testing';
import type { Expect } from '@noeldemartin/testing';
import { noop } from '@noeldemartin/utils/fluent/noop';
import { after } from '@noeldemartin/utils/helpers/time_helpers';
import type { Equals } from '@noeldemartin/utils/types';
import { describe, expect, it } from 'vite-plus/test';

import { tap } from './tap';

describe('tap helper', () => {
    it('taps using callbacks', () => {
        expect(tap({ foo: 'foo' }, (o) => (o.foo += 'bar')).foo).toBe('foobar');
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

    it('taps promises', async () => {
        // Arrange
        const calls: string[] = [];
        const promise = after().then(() => {
            calls.push('resolved');

            return 42;
        });

        // Act
        const result = await tap(promise, async (value) => {
            await after();

            calls.push(`tapped ${value}`);
        });

        calls.push('returned');

        // Assert
        expect(result).toBe(42);
        expect(calls).toEqual(['resolved', 'tapped 42', 'returned']);
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
const tappedPromiseResult = tap(Promise.resolve(42), (value) => value);

describe('tap helper types', () => {
    it(
        'has correct types',
        tt<
            | Expect<Equals<typeof numberResult, 42>>
            | Expect<Equals<typeof stringResult, '42'>>
            | Expect<Equals<typeof promisedNumberResult, Promise<number>>>
            | Expect<Equals<typeof tappedPromiseResult, Promise<number>>>
            | true
        >(),
    );
});
