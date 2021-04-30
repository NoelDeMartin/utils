import type { Constructor } from '@/types/index';

export function useMixins<T extends Constructor<unknown>>(baseClass: T, mixinClasses: Constructor<unknown>[]): T {
    const propertyDescriptors = mixinClasses
        .reduce((propertyDescriptors, mixinClass) => {
            Object.assign(propertyDescriptors, Object.getOwnPropertyDescriptors(mixinClass.prototype));

            return propertyDescriptors;
        }, {} as { [name: string]: PropertyDescriptor });

    for (const [propertyName, propertyDescriptor] of Object.entries(propertyDescriptors)) {
        Object.defineProperty(baseClass.prototype, propertyName, propertyDescriptor);
    }

    return baseClass;
}
