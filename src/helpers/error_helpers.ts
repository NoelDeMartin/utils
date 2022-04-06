import type { Constructor } from '@/types/index';

import { evaluate } from './value_helpers';
import type { EvaluatesTo } from './value_helpers';

/* eslint-disable @typescript-eslint/no-explicit-any, max-len */
export function assert(assertion: EvaluatesTo<boolean>, message?: string): void;
export function assert<E extends Error = Error>(assertion: EvaluatesTo<boolean>, errorClass?: Constructor<E>, ...params: ConstructorParameters<Constructor<E>>): void;
export function assert(assertion: EvaluatesTo<boolean>, messageOrClass?: string | Constructor<Error>, ...params: any[]): void {
    evaluate(assertion) || fail(messageOrClass as any, ...params);
}
/* eslint-enable @typescript-eslint/no-explicit-any, max-len */

export function catchError(callback: () => unknown): Error | null {
    try {
        callback();

        return null;
    } catch (error) {
        return error as Error;
    }
}

/* eslint-disable @typescript-eslint/no-explicit-any, max-len */
export function fail<T = any>(message?: string): T;
export function fail<T = any, E extends Error = Error>(errorClass?: Constructor<E>, ...params: ConstructorParameters<Constructor<E>>): T;
export function fail(messageOrClass: string | Constructor<Error> = 'Something went wrong', ...params: any[]): any {
    const errorClass = typeof messageOrClass === 'string' ? Error : messageOrClass;

    throw new errorClass(...(typeof messageOrClass === 'string' ? [messageOrClass] : params));
}
/* eslint-enable @typescript-eslint/no-explicit-any, max-len */
