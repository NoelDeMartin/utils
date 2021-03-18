import type { Constructor } from '@/types/index';

export function catchError(callback: () => unknown): Error | null {
    try {
        callback();

        return null;
    } catch (error) {
        return error;
    }
}

/* eslint-disable @typescript-eslint/no-explicit-any, max-len */
export function fail(message?: string): any;
export function fail<T extends Error>(errorClass?: Constructor<T>, ...params: ConstructorParameters<Constructor<T>>): any;
export function fail(messageOrClass: string | Constructor<Error> = 'Something went wrong', ...params: any[]): any {
    const errorClass = typeof messageOrClass === 'string' ? Error : messageOrClass;

    throw new errorClass(...(typeof messageOrClass === 'string' ? [messageOrClass] : params));
}
/* eslint-enable @typescript-eslint/no-explicit-any, max-len */
