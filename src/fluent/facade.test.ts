import { describe, expect, it } from 'vitest';

import { facade } from './facade';

describe('Facades', () => {

    it('reset instances', () => {
        // Arrange
        class CounterService {

            public count: number = 0;

            public add(): void {
                this.count++;
            }
        
        }

        const counter = facade(CounterService);

        counter.add();

        // Act
        counter.reset();

        // Assert
        expect(counter.count).toEqual(0);
    });

});
