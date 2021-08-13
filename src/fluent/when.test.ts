import { when } from '@/fluent/when';

class NumberStore {

    public value: null | number = null;

    public setValue(value: number) {
        this.value = value;
    }

}

describe('When helper', () => {

    it('works with truthy boolean', () => {
        const store = new NumberStore;

        when(store, true).setValue(42);
        expect(store.value).toEqual(42);
    });

    it('works with falsy boolean', () => {
        const store = new NumberStore;

        when(store, false).setValue(42);
        expect(store.value).toBeNull();
    });

    it('works with truthy callback', () => {
        const store = new NumberStore;

        when(store, () => true).setValue(42);
        expect(store.value).toEqual(42);
    });

    it('works with falsy callback', () => {
        const store = new NumberStore;

        when(store, () => false).setValue(42);
        expect(store.value).toBeNull();
    });

    it('works with type guards', () => {
        const store = new NumberStore as unknown as number;

        when(store, (store: unknown): store is NumberStore => store instanceof NumberStore).setValue(42);
        expect((store as unknown as NumberStore).value).toEqual(42);
    });

});
