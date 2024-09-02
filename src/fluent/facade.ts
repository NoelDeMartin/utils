import { getClassMethods } from '@/helpers/object_helpers';
import { mock } from '@/testing/mocking';
import type { Constructor } from '@/types/classes';

export type FacadeMethods<TInstance, TMock extends TInstance> = {
    setInstance(instance: TInstance): TInstance;
    setMockClass(mockClass: Constructor<TMock>): void;
    setMockFactory(mockFactory: () => TMock): void;
    setMockFacade(mockFacade: Facade<TMock>): void;
    requireInstance(): TInstance;
    mock(partialInstance?: Partial<TInstance>): TMock;
    reset(): TInstance;
};

export type Facade<TInstance, TMock extends TInstance = TInstance> = TInstance & FacadeMethods<TInstance, TMock>;

export function facade<TInstance extends object, TMock extends TInstance>(
    defaultClassOrFactory: (() => TInstance) | Constructor<TInstance>,
): Facade<TInstance, TMock> {
    let instance: TInstance | null = null;
    let mockClass: Constructor<TMock> | null = null;
    let mockFactory: (() => TMock) | null = null;
    let mockFacade: Facade<TMock> | null = null;

    function newDefaultInstance(): TInstance {
        try {
            return (defaultClassOrFactory as (() => TInstance))();
        } catch (error) {
            return new (defaultClassOrFactory as Constructor<TInstance>)();
        }
    }

    function newMockInstance(partialInstance?: Partial<TInstance>): TMock {
        if (partialInstance) {
            return mock<TMock>(partialInstance);
        }

        if (mockFacade) {
            return mock(mockFacade.reset());
        }

        if (mockClass) {
            return mock(new mockClass());
        }

        if (mockFactory) {
            return mockFactory();
        }

        return mock<TMock>(getClassMethods(facadeInstance.requireInstance()));
    }

    function setInstance(newInstance: TInstance): TInstance {
        instance = newInstance;

        return newInstance;
    }

    const facadeInstance: FacadeMethods<TInstance, TMock> = {
        setInstance,
        setMockClass: newMockClass => mockClass = newMockClass,
        setMockFactory: newMockFactory => mockFactory = newMockFactory,
        setMockFacade: newMockFacade => mockFacade = newMockFacade,
        requireInstance: () => instance ?? setInstance(newDefaultInstance()),
        mock: (partialInstance) => setInstance(newMockInstance(partialInstance)) as TMock,
        reset: () => setInstance(newDefaultInstance()),
    };

    return new Proxy(facadeInstance, {
        get: (_, property, receiver) => {
            const t = property !== 'constructor' && property in facadeInstance
                ? facadeInstance
                : facadeInstance.requireInstance();

            return Reflect.get(t, property, receiver);
        },
        set: (_, property, receiver) => Reflect.set(facadeInstance.requireInstance(), property, receiver),
    }) as unknown as Facade<TInstance, TMock>;
}

export function isFacade(value: unknown): value is Facade<unknown, Constructor<object>> {
    return typeof value === 'object'
        && value !== null
        && 'requireInstance' in value;
}

export function getFacadeInstance<T>(value: Facade<T>): T;
export function getFacadeInstance<T>(value: T): T;
export function getFacadeInstance<T>(value: T): T {
    return isFacade(value) ? value.requireInstance() as T : value;
}
