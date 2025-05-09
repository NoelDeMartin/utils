import { fail } from '@noeldemartin/utils/helpers/error_helpers';
import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';

const ITEMS_COLLECTION = 'items';

interface DatabaseSchema<T> extends DBSchema {
    items: {
        key: string;
        value: T;
    };
}

export default class IndexedDBMap<TItem> {

    private db: IDBPDatabase<DatabaseSchema<TItem>> | null = null;
    private namespace: string;

    constructor(namespace: string) {
        this.namespace = namespace;
    }

    public async has(key: string): Promise<boolean> {
        const db = await this.getConnection();
        const value = await db.get(ITEMS_COLLECTION, key);

        return value !== undefined;
    }

    public async get(key: string): Promise<TItem | undefined> {
        const db = await this.getConnection();

        return db.get(ITEMS_COLLECTION, key);
    }

    public async require(key: string): Promise<TItem> {
        const value = await this.get(key);

        return value ?? fail(`Missing required '${key}' IndexedDBMap value`);
    }

    public async set(key: string, value: TItem): Promise<void> {
        const db = await this.getConnection();

        await db.put(ITEMS_COLLECTION, value, key);
    }

    public async delete(key: string): Promise<void> {
        const db = await this.getConnection();

        await db.delete(ITEMS_COLLECTION, key);
    }

    public async clear(): Promise<void> {
        const db = await this.getConnection();

        await db.clear(ITEMS_COLLECTION);
    }

    public close(): void {
        if (!this.db) {
            return;
        }

        this.db.close();

        this.db = null;
    }

    private async getConnection(): Promise<IDBPDatabase<DatabaseSchema<TItem>>> {
        this.db = this.db ?? (await this.connect());

        return this.db;
    }

    private async connect(): Promise<IDBPDatabase<DatabaseSchema<TItem>>> {
        const databaseName = `${this.namespace}-map`;
        const db = await openDB<DatabaseSchema<TItem>>(databaseName, 1, {
            upgrade(database) {
                if (database.objectStoreNames.contains(ITEMS_COLLECTION)) {
                    return;
                }

                database.createObjectStore(ITEMS_COLLECTION);
            },
            blocked: () => fail(`Could not open '${databaseName}' IndexedDB`),
        });

        return db;
    }

}
