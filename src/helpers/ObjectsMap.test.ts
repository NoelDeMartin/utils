import ObjectsMap from './ObjectsMap';

describe('ObjectsMap', () => {

    it('gets items', () => {
        const map = ObjectsMap.createFromArray([{ name: 'John' }, { name: 'Amy' }], 'name');

        expect(map.get('John')).toEqual({ name: 'John' });
        expect(map.get('Amy')).toEqual({ name: 'Amy' });
        expect(map.get('Alice')).toBeUndefined();
    });

    it('can iterate over items', () => {
        let counter = 0;
        const items = [{ name: 'John' }, { name: 'Amy' }];
        const map = ObjectsMap.createFromArray(items, 'name');

        for (const [key, item] of map) {
            expect(key).toEqual(item.name);
            expect(item).toEqual(items[counter++]);
        }
    });

});
