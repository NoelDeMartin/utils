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

        return mock<TMock>(getClassMethods(facade.requireInstance()));
    }

    function setInstance(newInstance: TInstance): TInstance {
        instance = newInstance;

        return newInstance;
    }

    const facade: FacadeMethods<TInstance, TMock> = {
        setInstance,
        setMockClass: newMockClass => mockClass = newMockClass,
        setMockFactory: newMockFactory => mockFactory = newMockFactory,
        setMockFacade: newMockFacade => mockFacade = newMockFacade,
        requireInstance: () => instance ?? setInstance(newDefaultInstance()),
        mock: (partialInstance) => setInstance(newMockInstance(partialInstance)) as TMock,
        reset: () => setInstance(newDefaultInstance()),
    };

    return new Proxy(facade, {
        get: (_, property, receiver) => {
            const t = property !== 'constructor' && property in facade ? facade : facade.requireInstance();

            return Reflect.get(t, property, receiver);
        },
        set: (_, property, receiver) => Reflect.set(facade.requireInstance(), property, receiver),
    }) as unknown as Facade<TInstance, TMock>;
}

export function isFacade(facade: unknown): facade is Facade<unknown, Constructor<object>> {
    return typeof facade === 'object'
        && facade !== null
        && 'requireInstance' in facade;
}

export function getFacadeInstance<T>(facade: Facade<T>): T;
export function getFacadeInstance<T>(facade: T): T;
export function getFacadeInstance<T>(facade: T): T {
    return isFacade(facade) ? facade.requireInstance() as T : facade;
}
