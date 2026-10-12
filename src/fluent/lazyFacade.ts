import type { Constructor } from '@noeldemartin/utils/types/classes';
import type { GetObjectMethods, Override } from '@noeldemartin/utils/types/helpers';

const lazyFacadeMarker = Symbol('lazyFacade');

export interface LazyFacadeMethods<TInstance extends object = object> {
    getInstance(): Promise<TInstance>;
    getProperty<TProperty extends keyof TInstance>(property: TProperty): Promise<TInstance[TProperty]>;
    setInstance(instance: TInstance): TInstance;
    reset(): void;
}

export type LazyFacadeInstanceMethods<TInstance extends object> = {
    [K in GetObjectMethods<TInstance>]: TInstance[K] extends (...args: infer TArgs) => infer TResult
        ? (...args: TArgs) => Promise<Awaited<TResult>>
        : never;
};

export type LazyFacade<TInstance extends object = object> = Override<
    LazyFacadeInstanceMethods<TInstance>,
    LazyFacadeMethods<TInstance>
>;

export function lazyFacade<TInstance extends object>(factory: () => Promise<TInstance>): LazyFacade<TInstance>;
export function lazyFacade<TInstance extends object>(
    defaultClassOrFactory: (() => TInstance) | Constructor<TInstance>,
): LazyFacade<TInstance>;
export function lazyFacade<TInstance extends object>(
    defaultClassOrFactory: (() => TInstance | Promise<TInstance>) | Constructor<TInstance>,
): LazyFacade<TInstance> {
    let instance: TInstance | null = null;
    let loadingInstance: Promise<TInstance> | null = null;

    function newInstance(): TInstance | Promise<TInstance> {
        try {
            return (defaultClassOrFactory as () => TInstance | Promise<TInstance>)();
        } catch (error) {
            try {
                return new (defaultClassOrFactory as Constructor<TInstance>)();
            } catch {
                throw error;
            }
        }
    }

    async function getInstance(): Promise<TInstance> {
        while (!instance) {
            const loading = (loadingInstance ??= Promise.resolve().then(newInstance));

            try {
                const loadedInstance = await loading;

                if (loadingInstance === loading) {
                    instance = loadedInstance;
                }
            } catch (error) {
                if (loadingInstance !== loading) {
                    continue;
                }

                loadingInstance = null;

                throw error;
            }
        }

        return instance;
    }

    const lazyFacadeInstance: LazyFacadeMethods<TInstance> & { [lazyFacadeMarker]: true } = {
        [lazyFacadeMarker]: true,
        getInstance,
        getProperty: async (property) => (await getInstance())[property],
        setInstance: (_instance) => {
            instance = _instance;
            loadingInstance = null;

            return _instance;
        },
        reset: () => {
            instance = null;
            loadingInstance = null;
        },
    };

    return new Proxy(lazyFacadeInstance, {
        get: (_, property) => {
            if (Object.hasOwn(lazyFacadeInstance, property)) {
                return Reflect.get(lazyFacadeInstance, property);
            }

            if (property === 'then' || typeof property === 'symbol') {
                return undefined;
            }

            return async (...args: unknown[]) => {
                const target = await getInstance();
                const method = Reflect.get(target, property);

                if (typeof method !== 'function') {
                    throw new Error(`'${String(property)}' is not a function, use getProperty() to read properties`);
                }

                return method.apply(target, args);
            };
        },
        set: (_, property) => {
            throw new Error(`Can't set '${String(property)}' on a lazy facade, use getInstance() instead`);
        },
    }) as unknown as LazyFacade<TInstance>;
}

export function isLazyFacade(value: unknown): value is LazyFacade {
    return typeof value === 'object' && value !== null && lazyFacadeMarker in value;
}
