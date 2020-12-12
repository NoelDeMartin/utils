export class StorageSingleton {

    private static _instance: StorageSingleton;

    public static get instance(): StorageSingleton {
        return this._instance = this._instance || new StorageSingleton();
    }

    private constructor() {
        // Hide instantiation
    }

    public set(key: string, value: unknown): void {
        if (typeof value === 'undefined')
            value = '__undefined__';

        localStorage.setItem(key, JSON.stringify(value));
    }

    public get<T>(key: string): T | null;
    public get<T>(key: string, defaultValue: T): T;
    public get<T>(key: string, defaultValue: T | null = null): T | null {
        const value = localStorage.getItem(key);

        if (value === null)
            return defaultValue;

        if (value === '__undefined__')
            return undefined as unknown as T;

        return JSON.parse(value);
    }

    public has(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    public remove(key: string): void {
        localStorage.removeItem(key);
    }

    public pull<T>(key: string): T | null;
    public pull<T>(key: string, defaultValue: T): T;
    public pull<T>(key: string, defaultValue: T | null = null): T | null {
        if (!this.has(key))
            return defaultValue;

        const value = this.get<T>(key);

        this.remove(key);

        return value;
    }

}

export default StorageSingleton.instance;
