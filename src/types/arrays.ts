// Internal
export type CollapseTupleUnion<Tuple extends unknown[]> = _CollapseTupleUnionRecursion<Tuple, []>;
export type _CollapseTupleUnionRecursion<
    Tuple extends unknown[],
    Rest extends unknown[],
> = Rest['length'] extends Tuple['length']
    ? Rest
    : _CollapseTupleUnionRecursion<Tuple, [Tuple[Rest['length']], ...Rest]>;

export type RequiredTuple<Item, Length extends number> = Length extends Length
    ? number extends Length
        ? Item[]
        : _RequiredTupleRecursion<Item, Length, []>
    : never;
export type _RequiredTupleRecursion<Item, Length extends number, Rest extends unknown[]> = Rest['length'] extends Length
    ? Rest
    : _RequiredTupleRecursion<Item, Length, [Item, ...Rest]>;

export type _TupleRecursion<
    Tuple extends unknown[],
    Optional extends number,
    Rest extends unknown[],
> = Tuple['length'] extends Rest['length']
    ? Rest
    : Optional extends Rest['length']
      ? _TupleRecursion<Tuple, Optional, [Tuple[Rest['length']] | undefined, ...Rest]>
      : _TupleRecursion<Tuple, Optional, [Tuple[Rest['length']], ...Rest]>;

// External
export type ArrayDeepItem<Array> = Array extends (infer TItem)[] ? ArrayDeepItem<TItem> : Array;
export type ArrayIncludes<Array extends unknown[], Item> = Item extends Array[number] ? true : false;
export type ArrayItem<Array> = Array extends (infer Item)[] ? Item : never;
export type Tuple<Item, Length extends number, Optional extends number = number> = CollapseTupleUnion<
    _TupleRecursion<RequiredTuple<Item, Length>, Optional, []>
>;
