import { describe, expect, it } from 'vitest';

import JSError from '@noeldemartin/utils/helpers/JSError';

import { catchError, fail } from './error_helpers';

describe('Error helpers', () => {

    it('throws an error', () => {
        const error = catchError(() => fail());

        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Something went wrong');
    });

    it('throws an error message', () => {
        const error = catchError(() => fail('foobar'));

        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('foobar');
    });

    it('throws an error class', () => {
        const error = catchError(() => fail(StubError));

        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(StubError);
        expect((error as Error).message).toBe('Custom message: 500');
    });

    it('throws an error class with parameters', () => {
        const error = catchError(() => fail(StubError, 404));

        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(StubError);
        expect((error as StubError).message).toBe('Custom message: 404');
    });

});

class StubError extends JSError {

    constructor(errorCode: number = 500) {
        super(`Custom message: ${errorCode}`);
    }

}
