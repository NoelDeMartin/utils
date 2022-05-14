/* eslint-disable @typescript-eslint/no-unused-vars */

export default abstract class MagicObject {

    declare protected _proxy: this;

    constructor() {
        this.initializeProxy();

        return this._proxy;
    }

    protected __get(property: string): unknown {
        return undefined;
    }

    protected __set(property: string, value: unknown): void {
        Reflect.set(this, property, value);
    }

    protected __delete(property: string): void {
        Reflect.deleteProperty(this, property);
    }

    protected initializeProxy(): void {
        this._proxy = new Proxy(this, {
            get(target, property, receiver) {
                if (typeof property !== 'string' || property in target)
                    return Reflect.get(target, property, receiver);

                return target.__get(property);
            },
            set(target, property, value, receiver) {
                if (typeof property !== 'string' || property in target)
                    return Reflect.set(target, property, value, receiver);

                target.__set(property, value);

                return true;
            },
            deleteProperty(target, property) {
                if (typeof property !== 'string' || property in target)
                    return Reflect.deleteProperty(target, property);

                target.__delete(property);

                return true;
            },
        });
    }

}
