import CustomError from '@/helpers/Error';

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
        expect((error as Error).message).toBe('');
    });

    it('throws an error class with parameters', () => {
        const error = catchError(() => fail(StubError, 'foobar'));

        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(StubError);
        expect((error as StubError).message).toBe('foobar');
    });

});

class StubError extends CustomError {}
