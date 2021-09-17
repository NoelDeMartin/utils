import type { Constructor } from '@/types/index';

import { objectWithout } from './object_helpers';

const OBJECT_PROTOTYPE = Object.getPrototypeOf(Object);

function createMixedClass(baseClass: Constructor, mixinClasses: Constructor[]): Constructor {
    class MixedClass extends baseClass {

        public static __mixins = mixinClasses;

        constructor(...args: any[]) {
            super(...args);

            for (const mixinClass of mixinClasses) {
                const mixinInstance = new mixinClass(...args);

                Object.assign(this, mixinInstance);
            }

            return this;
        }

    }

    applyMixins(MixedClass, mixinClasses);

    return MixedClass;
}

function extendPrototype(mixedClass: Constructor, mixinClass: Constructor): void {
    if (mixinClass === Object)
        return;

    let parentMixin = mixinClass;

    do {
        const mixinDescriptors = objectWithout(
            Object.getOwnPropertyDescriptors(parentMixin.prototype),
            ['constructor'],
        );

        for (const [propertyName, propertyDescriptor] of Object.entries(mixinDescriptors)) {
            Object.defineProperty(mixedClass.prototype, propertyName, propertyDescriptor);
        }

        parentMixin = Object.getPrototypeOf(parentMixin);
    } while (parentMixin !== OBJECT_PROTOTYPE);
}

export function applyMixins<Base extends Constructor>(baseClass: Base, mixinClasses: Constructor[] = []): void {
    for (const mixinClass of mixinClasses) {
        extendPrototype(baseClass, mixinClass);
    }
}

/* eslint-disable max-len */
export type Cr<T> = Constructor<T>;

export function mixed<A>(mixins: [Cr<A>]): Cr<A>;
export function mixed<A, B>(mixins: [Cr<A>, Cr<B>]): Cr<A & B>;
export function mixed<A, B, C>(mixins: [Cr<A>, Cr<B>, Cr<C>]): Cr<A & B & C>;
export function mixed<A, B, C, D>(mixins: [Cr<A>, Cr<B>, Cr<C>, Cr<D>]): Cr<A & B & C & D>;
export function mixed<Base, A>(baseClass: Base, mixins: [Cr<A>]): Base & Cr<A>;
export function mixed<Base, A, B>(baseClass: Base, mixins: [Cr<A>, Cr<B>]): Base & Cr<A & B>;
export function mixed<Base, A, B, C>(baseClass: Base, mixins: [Cr<A>, Cr<B>, Cr<C>]): Base & Cr<A & B & C>;
export function mixed<Base, A, B, C, D>(baseClass: Base, mixins: [Cr<A>, Cr<B>, Cr<C>, Cr<D>]): Base & Cr<A & B & C & D>;
/* eslint-enable max-len */

export function mixed(
    baseClassOrMixinClasses: Constructor | Constructor[],
    mixinClassesOrNothing: Constructor[] = [],
): unknown {
    const baseClass = Array.isArray(baseClassOrMixinClasses) ? Object : baseClassOrMixinClasses;
    const mixinClasses = Array.isArray(baseClassOrMixinClasses) ? baseClassOrMixinClasses : mixinClassesOrNothing;

    return createMixedClass(baseClass, mixinClasses);
}

export function mixedWithoutTypes(mixins: Constructor[]): Object;
export function mixedWithoutTypes<Base>(baseClass: Base, mixins: Constructor[]): Base;
export function mixedWithoutTypes(...args: any[]): unknown {
    return (mixed as Function)(...args);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function usesMixin(target: any, mixin: Constructor): boolean {
    return (target?.__mixins ?? target?.__proto__?.constructor?.__mixins ?? []).includes(mixin);
}
