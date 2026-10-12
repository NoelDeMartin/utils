import { facade } from '@noeldemartin/utils/fluent/facade';

const DEFAULT_INSTANCE = {};

export class StorageService {
    public set<T = unknown>(key: string, value: T): void {
        this.storage.setItem(key, typeof value === 'undefined' ? '__undefined__' : JSON.stringify(value));
    }

    public get<T>(key: string): T | null;
    public get<T>(key: string, defaultValue: T): T;
    public get<T>(key: string, defaultValue: T | null = null): T | null {
        const value = this.storage.getItem(key);

        if (value === null) return defaultValue;

        if (value === '__undefined__') return undefined as unknown as T;

        return JSON.parse(value);
    }

    public require<T>(key: string): T {
        const value = this.get(key, DEFAULT_INSTANCE);

        if (value === DEFAULT_INSTANCE) throw new Error(`Failed getting required key from local storage: '${key}'`);

        return value as T;
    }

    public has(key: string): boolean {
        return this.storage.getItem(key) !== null;
    }

    public remove(key: string): void {
        this.storage.removeItem(key);
    }

    public pull<T>(key: string): T | null;
    public pull<T>(key: string, defaultValue: T): T;
    public pull<T>(key: string, defaultValue: T | null = null): T | null {
        if (!this.has(key)) return defaultValue;

        const value = this.get<T>(key);

        this.remove(key);

        return value;
    }

    protected get storage(): Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> {
        return localStorage;
    }
}

export default facade(StorageService);
