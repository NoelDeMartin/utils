type Listener = () => void;

export default class Semaphore {

    private count: number;
    private listeners: Set<Listener>;

    public constructor(count: number = 1) {
        this.count = count;
        this.listeners = new Set();
    }

    public acquire(): Promise<void> {
        if (this.count === 0) {
            return this.waitAvailable().then(() => this.acquire());
        }

        this.count = Math.max(this.count - 1, 0);

        return Promise.resolve();
    }

    public release(): void {
        this.count++;

        this.notifyAvailable();
    }

    public isAvailable(): boolean {
        return this.count !== 0;
    }

    public async run<T>(operation: () => Promise<T>): Promise<T> {
        await this.acquire();

        try {
            const result = await operation();

            return result;
        } finally {
            this.release();
        }
    }

    private async waitAvailable(): Promise<void> {
        while (!this.isAvailable()) {
            await new Promise(resolve => {
                const listener = () => {
                    this.listeners.delete(listener);

                    resolve(null);
                };

                this.listeners.add(listener);
            });
        }
    }

    private notifyAvailable(): void {
        this.listeners.forEach(listener => listener());
    }

}
