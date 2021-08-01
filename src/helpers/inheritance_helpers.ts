import type { Constructor } from '@/types/index';

import { objectWithout } from './object_helpers';

const OBJECT_PROTOTYPE = Object.getPrototypeOf(Object);

function createMixedClass(baseClass: Constructor, mixinClasses: Constructor[]): Constructor {
    class MixedClass extends baseClass {

        constructor(...args: any[]) {
            super(...args);

            for (const mixinClass of mixinClasses) {
                const mixinInstance = new mixinClass(...args);

                Object.assign(this, mixinInstance);
            }

            return this;
        }

    }

    for (const mixinClass of mixinClasses) {
        extendPrototype(MixedClass, mixinClass);
    }

    return MixedClass;
}

function extendPrototype(mixedClass: Constructor, mixinClass: Constructor): void {
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

export function mixinFor<T>(_: Constructor<T>): Constructor<T> {
    return class {} as unknown as Constructor<T>;
}

/* eslint-disable max-len */
type Cr<T> = Constructor<T>;

export function withMixins<A>(mixins: [Cr<A>]): Cr<A>;
export function withMixins<A, B>(mixins: [Cr<A>, Cr<B>]): Cr<A & B>;
export function withMixins<A, B, C>(mixins: [Cr<A>, Cr<B>, Cr<C>]): Cr<A & B & C>;
export function withMixins<A, B, C, D>(mixins: [Cr<A>, Cr<B>, Cr<C>, Cr<D>]): Cr<A & B & C & D>;
export function withMixins<Base, A>(baseClass: Cr<Base>, mixins: [Cr<A>]): Cr<Base & A>;
export function withMixins<Base, A, B>(baseClass: Cr<Base>, mixins: [Cr<A>, Cr<B>]): Cr<Base & A & B>;
export function withMixins<Base, A, B, C>(baseClass: Cr<Base>, mixins: [Cr<A>, Cr<B>, Cr<C>]): Cr<Base & A & B & C>;
export function withMixins<Base, A, B, C, D>(baseClass: Cr<Base>, mixins: [Cr<A>, Cr<B>, Cr<C>, Cr<D>]): Cr<Base & A & B & C & D>;
/* eslint-enable max-len */

export function withMixins(
    baseClassOrMixinClasses: Constructor | Constructor[],
    mixinClassesOrNothing: Constructor[] = [],
): unknown {
    const baseClass = Array.isArray(baseClassOrMixinClasses) ? Object : baseClassOrMixinClasses;
    const mixinClasses = Array.isArray(baseClassOrMixinClasses) ? baseClassOrMixinClasses : mixinClassesOrNothing;

    return createMixedClass(baseClass, mixinClasses);
}
