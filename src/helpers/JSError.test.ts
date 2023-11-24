import { catchError, fail } from '@/helpers/error_helpers';

import JSError from './JSError';

describe('JSError', () => {

    it('behaves like an error', () => {
        // Act
        const error = catchError(() => fail(JSError, 'foobar'));

        // Assert
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(JSError);

        const jsError = error as Error;
        expect(jsError.name).toEqual('Error');
        expect(jsError.message).toEqual('foobar');
        expect(jsError.stack).not.toBeNull();
        expect(jsError.stack).toContain('Error.test');
    });

    it('can be subclassed', () => {
        // Act
        const error = catchError(() => fail(StubError, 'foobar'));

        // Assert
        expect(error).not.toBeNull();
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(JSError);
        expect(error).toBeInstanceOf(StubError);

        const stubError = error as StubError;
        expect(stubError.name).toEqual('StubError');
        expect(stubError.message).toEqual('Custom message: foobar');
        expect(stubError.stack).not.toBeNull();
        expect(stubError.stack).toContain('Error.test');
    });

});

class StubError extends JSError {

    constructor(m: string) {
        super(`Custom message: ${m}`);
    }

}
