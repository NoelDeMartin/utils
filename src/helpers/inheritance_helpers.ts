import type { Constructor } from '@/types/index';

import { objectWithout } from './object_helpers';

export function useMixins<T extends Constructor<unknown>>(baseClass: T, mixinClasses: Constructor<unknown>[]): T {
    for (const mixinClass of mixinClasses) {
        const mixinDescriptors = objectWithout(
            Object.getOwnPropertyDescriptors(mixinClass.prototype),
            ['constructor'],
        );

        for (const [propertyName, propertyDescriptor] of Object.entries(mixinDescriptors)) {
            Object.defineProperty(baseClass.prototype, propertyName, propertyDescriptor);
        }
    }

    return baseClass;
}
