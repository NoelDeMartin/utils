export type Tuple<Item, Length extends number> =
    Length extends Length
        ? number extends Length
            ? Item[]
            : RecursiveTuple<Item, Length, []>
        : never;

export type RecursiveTuple<Item, Length extends number, Rest extends unknown[]> =
    Rest['length'] extends Length
        ? Rest
        : RecursiveTuple<Item, Length, [Item, ...Rest]>;
