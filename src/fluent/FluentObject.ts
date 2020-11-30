import { stringUncapitalize } from '../helpers/string_helpers';

type FluentHelpers<
    FluentClass,
    Primitive extends Record<PrimitiveKeys, unknown>,
    PrimitiveKeys extends string | number | symbol,
    Helpers,
    HelpersPrefix extends string,
> = {
    [
        k in keyof Helpers extends `${HelpersPrefix}${infer M}`
            ? `${Uncapitalize<M>}`
            : never
    ]: Helpers[`${HelpersPrefix}${Capitalize<k>}`] extends (value: Primitive, ...params: infer P) => infer R
        ? (
            R extends Primitive
                ? (...params: P) => FluentProxy<FluentClass, Primitive, PrimitiveKeys, Helpers, HelpersPrefix>
                : (...params: P) => R)
        : never;
};

export type FluentProxy<
    FluentClass,
    Primitive extends Record<PrimitiveKeys, unknown>,
    PrimitiveKeys extends string | number | symbol,
    Helpers,
    HelpersPrefix extends string,
> =  FluentClass & FluentHelpers<FluentClass, Primitive, PrimitiveKeys, Helpers, HelpersPrefix> & {
    [K in PrimitiveKeys]: Primitive extends Record<K, (...args: infer P) => Primitive>
        ? (...args: P) => FluentProxy<FluentClass, Primitive, PrimitiveKeys, Helpers, HelpersPrefix>
        : Primitive[K];
};

export default abstract class FluentObject<Primitive> {

    protected value: Primitive;
    private helperMethods: Record<string, (...args: any[]) => unknown>;

    protected constructor(value: Primitive, helpersPrefix: string, helpers: Record<string, Closure> = {}) {
        this.value = value;
        this.helperMethods = this.createHelperMethods(helpersPrefix, helpers);

        return this.createProxy() as unknown as this;
    }

    protected abstract isPrimitive(value: unknown): value is Primitive;

    protected create(value: Primitive): this {
        const classConstructor = this.constructor as unknown as { new(value: Primitive): unknown };

        return new classConstructor(value) as this;
    }

    protected createProxy(): unknown {
        return new Proxy(this, {
            get: (target, propertyKey, receiver) => {
                if (propertyKey in target)
                    return Reflect.get(target, propertyKey, receiver);

                if (propertyKey in this.helperMethods)
                    return this.helperMethods[propertyKey as string];

                return this.nativeGet(propertyKey as keyof Primitive);
            },
        });
    }

    private nativeGet(property: keyof Primitive): unknown {
        const value = this.value[property as keyof Primitive];

        if (typeof value !== 'function')
            return value;

        const nativeMethod = value as unknown as Closure;

        return (...args: any[]) => {
            const result = nativeMethod.call(this, ...args);

            return this.isPrimitive(result) ? this.create(result) : result;
        };
    }

    private createHelperMethods(
        prefix: string,
        helpers: Record<string, Closure>,
    ): Record<string, (...args: any[]) => unknown> {
        return Object.entries(helpers).reduce((helperMethods, [helperName, helperMethod]) => {
            if (!helperName.startsWith(prefix))
                return helperMethods;

            helperMethods[stringUncapitalize(helperName.substr(6))] = (...args: any[]) => {
                const result = helperMethod(this.value, ...args);

                return this.isPrimitive(result) ? this.create(result) : result;
            };

            return helperMethods;
        }, {} as Record<string, (...args: any[]) => unknown>);
    }

}
