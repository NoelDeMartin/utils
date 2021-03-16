import { catchError, fail } from '@/helpers/error_helpers';

import CustomError from './Error';

describe('SoukaiError', () => {

    it('behaves like an error', () => {
        // Act
        const error = catchError(() => fail('foobar', CustomError));

        // Assert
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(CustomError);

        const customError = error as Error;
        expect(customError.name).toEqual('Error');
        expect(customError.message).toEqual('foobar');
        expect(customError.stack).not.toBeNull();
        expect(customError.stack).toContain('Error.test');
    });

    it('can be subclassed', () => {
        // Act
        const error = catchError(() => fail('foobar', StubError));

        // Assert
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(CustomError);
        expect(error).toBeInstanceOf(StubError);

        const stubError = error as StubError;
        expect(stubError.name).toEqual('StubError');
        expect(stubError.message).toEqual('Custom message: foobar');
        expect(stubError.stack).not.toBeNull();
        expect(stubError.stack).toContain('Error.test');
    });

});

class StubError extends CustomError {

    constructor(m: string) {
        super(`Custom message: ${m}`);
    }

}
