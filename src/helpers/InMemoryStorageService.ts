import { StorageService } from '@noeldemartin/utils/helpers/Storage';

export default class InMemoryStorageService extends StorageService {
    public readonly items = new Map<string, string>();

    protected override get storage(): Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> {
        return {
            getItem: (key) => this.items.get(key) ?? null,
            setItem: (key, value) => void this.items.set(key, value),
            removeItem: (key) => void this.items.delete(key),
        };
    }
}
