import { runtimeGlobal } from '@/helpers/runtime_helpers';
import type { ClosureArgs, ReplaceConstructorArgs } from '@/types/index';

const BaseError = runtimeGlobal<typeof globalThis>().Error;

class Error extends BaseError {

    constructor(message?: string, options?: ErrorOptions) {
        super(...[message, options] as ClosureArgs);

        // Fix inheritance: https://stackoverflow.com/questions/41102060/typescript-extending-error-class
        this.name = new.target.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }

}

export interface ErrorOptions {
    cause?: unknown;
}

export default Error as ReplaceConstructorArgs<typeof BaseError, [message?: string, options?: ErrorOptions]>;
