import type { Constructor } from '@noeldemartin/utils/types/classes';

const extensions: FacadeExtension[] = [];

export type FacadeExtension = (facadeInstance: FacadeMethods) => void;

export interface FacadeMethods<TInstance extends object = object> {
    newInstance(): TInstance;
    requireInstance(): TInstance;
    setInstance(instance: TInstance): TInstance;
    reset(): TInstance;
}

export type Facade<TInstance extends object = object> = TInstance & FacadeMethods<TInstance>;

export function facade<TInstance extends object>(
    defaultClassOrFactory: (() => TInstance) | Constructor<TInstance>,
): Facade<TInstance> {
    let instance: TInstance | null = null;

    function newInstance(): TInstance {
        try {
            return (defaultClassOrFactory as () => TInstance)();
        } catch (error) {
            return new (defaultClassOrFactory as Constructor<TInstance>)();
        }
    }

    function setInstance(_instance: TInstance): TInstance {
        instance = _instance;

        return _instance;
    }

    const facadeInstance: FacadeMethods<TInstance> = {
        setInstance,
        newInstance,
        requireInstance: () => instance ?? setInstance(newInstance()),
        reset: () => setInstance(newInstance()),
    };

    extensions.forEach((extension) => extension(facadeInstance));

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

export function extendFacadeMethods(extension: FacadeExtension): void {
    extensions.push(extension);
}

export function isFacade(value: unknown): value is Facade {
    return typeof value === 'object' && value !== null && 'requireInstance' in value;
}

export function getFacadeInstance<T extends object>(value: Facade<T>): T;
export function getFacadeInstance<T>(value: T): T;
export function getFacadeInstance<T>(value: T): T {
    return isFacade(value) ? (value.requireInstance() as T) : value;
}
