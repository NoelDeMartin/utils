import { describe, expect, it } from 'vite-plus/test';

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

    it('sets properties', () => {
        // Arrange
        class CounterService {
            public count: number = 0;
        }

        const counter = facade(CounterService);

        // Act
        counter.count = 3;

        // Assert
        expect(counter.count).toEqual(3);
        expect(counter.requireInstance().count).toEqual(3);
    });
});
