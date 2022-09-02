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

    it('filters items by key', () => expectUsersFilter(
        [
            { name: 'John' },
            { name: 'Amy' },
            { name: 'Bob' },
        ],
        (_, name) => name !== 'Amy',
        [
            { name: 'John' },
            { name: 'Bob' },
        ],
    ));

    it('filters items by value', () => expectUsersFilter(
        [
            { name: 'John', age: 12 },
            { name: 'Amy', age: 18 },
            { name: 'Bob', age: 23 },
        ],
        ({ age }) => age >= 18,
        [
            { name: 'Amy', age: 18 },
            { name: 'Bob', age: 23 },
        ],
    ));

});

function expectUsersFilter<T extends { name: string }>(
    initial: T[],
    condition: (item: T, name: string) => boolean,
    expected: T[],
) {
    const filtered = ObjectsMap.createFromArray(initial, 'name')
        .filter(condition)
        .getItems();

    expect(filtered).toEqual(expected);
}
