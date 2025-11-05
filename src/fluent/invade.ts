import type { Override } from '@noeldemartin/utils/types';

// @ts-expect-error Allow invades
export type Invaded<TObject, TMethods extends string> = { [K in TMethods]: TObject[K] };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function invade<T, TMethods extends string>(object: T, methods: TMethods[]): Override<T, Invaded<T, TMethods>> {
    return object as Override<T, Invaded<T, TMethods>>;
}
