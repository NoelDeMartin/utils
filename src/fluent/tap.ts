/* eslint-disable @typescript-eslint/ban-types */

// Typescript equivalent of Laravel's tap helper method
// @see https://medium.com/@taylorotwell/tap-tap-tap-1fc6fc1f93a6
// @see https://github.com/laravel/framework/blob/v7.8.0/src/Illuminate/Support/helpers.php#L422..L431

export type Tapped<Target extends object> = {
    [prop in keyof Target]: Target[prop] extends (...params: infer Params) => unknown
        ? (...params: Params) => Tapped<Target>
        : Target[prop];
}

function proxyTap<Target extends object>(target: Target): Tapped<Target> {
    const proxy = new Proxy(target, {
        get(target: object, key: PropertyKey, receiver?: unknown) {
            const prop = Reflect.get(target, key, receiver);

            if (typeof prop !== 'function')
                return prop;

            return (...params: any[]) => {
                prop.call(target, ...params);

                return proxy;
            };
        },
    }) as Tapped<Target>;

    return proxy;
}

export function tap<Target extends object>(target: Target): Tapped<Target>;
export function tap<Target extends object>(
    target: Target,
    callback: (target: Target) => unknown,
): Target;
export function tap<Target extends object>(
    target: Target,
    callback?: (target: Target) => unknown,
): Target | Tapped<Target> {
    if (!callback)
        return proxyTap(target);

    callback(target);

    return target;
}
