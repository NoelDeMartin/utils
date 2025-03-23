import type { Constructor } from '../types/classes';
import type { ClosureArgs } from '../types/helpers';

export interface MagicObjectProxy<T> {
    target: T;
    instance: T;
}

export type MagicObjectConstructor<T extends MagicObject = MagicObject> = Constructor<T> & typeof MagicObject;

export default class MagicObject {

    private static __conjuring: boolean;
    private static __reservedProperties: WeakMap<typeof MagicObject, Set<string>> = new WeakMap();

    protected static isConjuring(): boolean {
        return this.__conjuring;
    }

    private static isMagicReady(): boolean {
        return this.__reservedProperties.has(this);
    }

    private static prepareMagic(): void {
        this.__conjuring = true;
        this.__reservedProperties.set(this, new Set(Object.getOwnPropertyNames(new this())));
        this.__conjuring = false;
    }

    protected static isReservedProperty(property: string): boolean {
        return !!this.__reservedProperties.get(this)?.has(property);
    }

    declare protected _proxy: MagicObjectProxy<this>;

    constructor(...args: ClosureArgs) {
        if (this.static().isConjuring()) {
            return;
        }

        if (!this.static().isMagicReady()) {
            this.static().prepareMagic();
        }

        this._proxy = this.createProxy();

        this.initialize(...args);

        return this._proxy.instance;
    }

    public static<T extends typeof MagicObject>(): T;
    public static<T extends typeof MagicObject, K extends keyof T>(property: K): T[K];
    public static<T extends typeof MagicObject, K extends keyof T>(property?: K): T | T[K] {
        const constructor = this.constructor as T;

        if (!property) {
            return constructor;
        }

        return constructor[property];
    }

    protected reserveProperty(property: string): void {
        Object.assign(this, { [property]: null });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected initialize(...args: ClosureArgs): void {
        //
    }

    protected __get(property: string): unknown {
        return Reflect.get(this._proxy.target, property);
    }

    protected __set(property: string, value: unknown): void {
        Reflect.set(this._proxy.target, property, value);
    }

    protected __delete(property: string): void {
        Reflect.deleteProperty(this._proxy.target, property);
    }

    protected createProxy(): MagicObjectProxy<this> {
        const Static = this.static();

        return {
            target: this,
            instance: new Proxy(this, {
                get(target, property, receiver) {
                    if (typeof property !== 'string' || property in target || Static.isReservedProperty(property)) {
                        return Reflect.get(target, property, receiver);
                    }

                    return target.__get(property);
                },
                set(target, property, value, receiver) {
                    if (typeof property !== 'string' || property in target || Static.isReservedProperty(property)) {
                        return Reflect.set(target, property, value, receiver);
                    }

                    target.__set(property, value);

                    return true;
                },
                deleteProperty(target, property) {
                    if (typeof property !== 'string' || property in target || Static.isReservedProperty(property)) {
                        return Reflect.deleteProperty(target, property);
                    }

                    target.__delete(property);

                    return true;
                },
            }),
        };
    }

}
