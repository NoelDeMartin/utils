import { describe, expect, it } from 'vitest';

import { range } from '@noeldemartin/utils/helpers/array_helpers';

import { asyncFirst } from './promise_helpers';

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

});
