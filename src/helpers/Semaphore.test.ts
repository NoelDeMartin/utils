import { describe, expect, it } from 'vitest';

import Semaphore from '@noeldemartin/utils/helpers/Semaphore';
import { after } from '@noeldemartin/utils/helpers/time_helpers';
import { fail } from '@noeldemartin/utils/helpers/error_helpers';
import { range } from '@noeldemartin/utils/helpers/array_helpers';

describe('Semaphore', () => {

    it('Locks concurrent threads', async () => {
        // Arrange
        class Writer {

            private pen?: Promise<void>;

            public async write(item: string): Promise<void> {
                this.pen = this.pen ?? lock.acquire();

                await this.pen;

                items.push(item);
            }

            public releasePen(): void {
                if (!this.pen) return;

                lock.release();

                delete this.pen;
            }
        
        }

        const items: string[] = [];
        const lock = new Semaphore();
        const writers: [Writer, Writer] = [new Writer(), new Writer()];

        // Act
        const promises: Promise<void>[] = [];
        promises.push(writers[0].write('one'));
        promises.push(writers[1].write('two'));
        promises.push(writers[0].write('three'));
        writers[1].releasePen();
        writers[0].releasePen();

        await Promise.all(promises);

        // Assert
        expect(items).toEqual(['one', 'three', 'two']);
    });

    it('Locks threads launched synchronously', async () => {
        // Arrange
        const lock = new Semaphore();
        const items: string[] = [];
        const concurrency = 100;

        // Act
        await Promise.all(
            range(concurrency).map((i) =>
                lock.run(async () => {
                    await after({ ms: Math.floor(Math.random() * 10) });

                    items.push(`Item #${i}`);
                })),
        );

        // Assert
        expect(items).toEqual(range(concurrency).map((i) => `Item #${i}`));
    });

    it('Releases threads on error', async () => {
        // Arrange
        const lock = new Semaphore();
        let failed = false;

        // Act
        try {
            await lock.run(() => fail());
        } catch (_) {
            // Silence error.
            failed = true;
        }

        // Assert
        expect(lock.isAvailable()).toBe(true);
        expect(failed).toBe(true);
    });

});
