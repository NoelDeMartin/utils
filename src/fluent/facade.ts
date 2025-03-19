import type { Constructor } from '@noeldemartin/utils/types/classes';

export type FacadeMethods<TInstance> = {
    setInstance(instance: TInstance): TInstance;
    requireInstance(): TInstance;
    reset(): TInstance;
};

export type Facade<TInstance> = TInstance & FacadeMethods<TInstance>;

export function facade<TInstance extends object>(
    defaultClassOrFactory: (() => TInstance) | Constructor<TInstance>,
): Facade<TInstance> {
    let instance: TInstance | null = null;

    function newDefaultInstance(): TInstance {
        try {
            return (defaultClassOrFactory as () => TInstance)();
        } catch (error) {
            return new (defaultClassOrFactory as Constructor<TInstance>)();
        }
    }

    function setInstance(newInstance: TInstance): TInstance {
        instance = newInstance;

        return newInstance;
    }

    const facadeInstance: FacadeMethods<TInstance> = {
        setInstance,
        requireInstance: () => instance ?? setInstance(newDefaultInstance()),
        reset: () => setInstance(newDefaultInstance()),
    };

    return new Proxy(facadeInstance, {
        get: (_, property, receiver) => {
            const t =
                property !== 'constructor' && property in facadeInstance
                    ? facadeInstance
                    : facadeInstance.requireInstance();

            return Reflect.get(t, property, receiver);
        },
        set: (_, property, receiver) => Reflect.set(facadeInstance.requireInstance(), property, receiver),
    }) as unknown as Facade<TInstance>;
}

export function isFacade(value: unknown): value is Facade<unknown> {
    return typeof value === 'object' && value !== null && 'requireInstance' in value;
}

export function getFacadeInstance<T>(value: Facade<T>): T;
export function getFacadeInstance<T>(value: T): T;
export function getFacadeInstance<T>(value: T): T {
    return isFacade(value) ? (value.requireInstance() as T) : value;
}
