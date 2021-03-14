import type { Constructor } from '@/types/index';

export function catchError(callback: () => unknown): Error | null {
    try {
        callback();

        return null;
    } catch (error) {
        return error;
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fail(message: string, errorClass: Constructor<Error> = Error): any {
    throw new errorClass(message);
}
