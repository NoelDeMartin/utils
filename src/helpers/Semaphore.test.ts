import Semaphore from '@/helpers/Semaphore';

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
                if (!this.pen)
                    return;

                lock.release();

                delete this.pen;
            }

        }

        const items: string[] = [];
        const lock = new Semaphore;
        const writers = [new Writer, new Writer];

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

});
