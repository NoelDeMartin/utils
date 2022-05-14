import type { Constructor } from '@/main';

export type MagicObjectConstructor<T extends MagicObject = MagicObject> = Constructor<T> & typeof MagicObject;

export default class MagicObject {

    private static __buildingPureInstance: boolean;
    private static __reservedProperties: WeakMap<typeof MagicObject, Set<string>> = new WeakMap;

    private static buildingPureInstance(this: MagicObjectConstructor): boolean {
        if (this.__buildingPureInstance)
            return true;

        if (this.__reservedProperties.has(this))
            return false;

        this.__buildingPureInstance = true;
        this.__reservedProperties.set(this, new Set(Object.getOwnPropertyNames(new this)));
        this.__buildingPureInstance = false;

        return false;
    }

    protected static isReservedProperty(property: string): boolean {
        return !!this.__reservedProperties.get(this)?.has(property);
    }

    declare protected _proxyTarget: this;
    declare protected _proxy: this;

    constructor() {
        if (this.static().buildingPureInstance())
            return;

        this.initializeProxy();

        return this._proxy;
    }

    protected static(): MagicObjectConstructor<this> {
        return this.constructor as MagicObjectConstructor<this>;
    }

    protected __get(property: string): unknown {
        return Reflect.get(this._proxyTarget, property);
    }

    protected __set(property: string, value: unknown): void {
        Reflect.set(this._proxyTarget, property, value);
    }

    protected __delete(property: string): void {
        Reflect.deleteProperty(this._proxyTarget, property);
    }

    protected initializeProxy(): void {
        const Static = this.static();

        this._proxyTarget = this;
        this._proxy = new Proxy(this._proxyTarget, {
            get(target, property, receiver) {
                if (typeof property !== 'string' || Static.isReservedProperty(property)) {
                    return Reflect.get(target, property, receiver);
                }

                return target.__get(property);
            },
            set(target, property, value, receiver) {
                if (typeof property !== 'string' || Static.isReservedProperty(property)) {
                    return Reflect.set(target, property, value, receiver);
                }

                target.__set(property, value);

                return true;
            },
            deleteProperty(target, property) {
                if (typeof property !== 'string' || Static.isReservedProperty(property)) {
                    return Reflect.deleteProperty(target, property);
                }

                target.__delete(property);

                return true;
            },
        });
    }

}
