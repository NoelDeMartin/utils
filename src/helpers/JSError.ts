import { runtimeGlobal } from '@/helpers/runtime_helpers';
import type { ClosureArgs, ReplaceConstructorArgs } from '@/types/index';

const BaseError = runtimeGlobal<typeof globalThis>().Error;

class JSError extends BaseError {

    constructor(message?: string, options?: JSErrorOptions) {
        super(...[message, options] as ClosureArgs);

        // Fix inheritance: https://stackoverflow.com/questions/41102060/typescript-extending-error-class
        this.name = new.target.name === 'JSError' ? 'Error' : new.target.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }

}

export default JSError as ReplaceConstructorArgs<typeof BaseError, [message?: string, options?: JSErrorOptions]>;

export interface JSErrorOptions {
    cause?: unknown;
}
