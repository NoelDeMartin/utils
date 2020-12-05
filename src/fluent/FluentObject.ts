export type Helper<Primitive=unknown> = (value: Primitive, ...args: any[]) => unknown;
export type HelperParams<Primitive, Helper> =
    Helper extends (value: Primitive, ...args: infer P) => unknown ? P : never;

export type FluentPrimitiveMethods<
    FluentClass,
    Primitive extends Record<PrimitiveKey, unknown>,
    PrimitiveKey extends string | number | symbol,
    Helpers extends Record<string, Helper<Primitive>>,
> = {
    [K in PrimitiveKey]: Primitive extends Record<K, (...args: infer P) => Primitive>
        ? (...args: P) => FluentInstance<FluentClass, Primitive, PrimitiveKey, Helpers>
        : Primitive[K];
};

export type FluentHelperMethods<
    FluentClass,
    Primitive extends Record<PrimitiveKey, unknown>,
    PrimitiveKey extends string | number | symbol,
    Helpers extends Record<string, Helper<Primitive>>,
> = {
    [K in keyof Helpers]: Helpers extends Record<K, (value: Primitive, ...args: any[]) => Primitive>
        ? (...args: HelperParams<Primitive, Helpers[K]>) =>
            FluentInstance<FluentClass, Primitive, PrimitiveKey, Helpers>
        : (...args: HelperParams<Primitive, Helpers[K]>) => ReturnType<Helpers[K]>
};

export type FluentInstance<
    FluentClass,
    Primitive extends Record<PrimitiveKey, unknown>,
    PrimitiveKey extends string | number | symbol,
    Helpers extends Record<string, Helper<Primitive>>,
> = FluentClass &
    FluentHelperMethods<FluentClass, Primitive, PrimitiveKey, Helpers> &
    FluentPrimitiveMethods<FluentClass, Primitive, PrimitiveKey, Helpers>;

export function addHelperMethodsToPrototype(
    fluentClass: { prototype: unknown },
    helpers: Record<string, Closure>,
): void {
    const prototype = fluentClass.prototype as Record<string, Closure>;

    for (const [name, method] of Object.entries(helpers)) {
        prototype[name] = function(...args: any[]) {
            const value = method(this.value, ...args);

            return this.chain(value);
        };
    }
}

export function addPrimitiveMethodsToPrototype(
    fluentClass: { prototype: unknown },
    primitiveClass: { prototype: unknown },
): void {
    const prototype = fluentClass.prototype as Record<string, Closure>;
    const descriptors = Object.getOwnPropertyDescriptors(primitiveClass.prototype);

    for (const [name, descriptor] of Object.entries(descriptors)) {
        if (name in prototype)
            continue;

        if (typeof descriptor.value !== 'function') {
            Object.defineProperty(prototype, name, {
                get() {
                    return this.chain(this.value[name]);
                },
            });

            continue;
        }

        prototype[name] = function(...args: any[]) {
            const value = descriptor.value.call(this.value, ...args);

            return this.chain(value);
        };
    }
}

export default abstract class FluentObject<Primitive> {

    public static isPrimitive(value: unknown): boolean {
        return this.prototype.isPrimitive(value);
    }

    constructor(protected value: Primitive) {}

    protected abstract isPrimitive(value: unknown): value is Primitive;

    protected create(value: Primitive): this {
        const constructor = this.constructor as unknown as { new(value: Primitive): unknown };

        return new constructor(value) as this;
    }

    protected chain(value: unknown): unknown {
        return this.isPrimitive(value) ? this.create(value) : value;
    }

}
