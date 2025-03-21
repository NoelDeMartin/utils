import { runtimeGlobal } from '@noeldemartin/utils/helpers/runtime_helpers';
import type { ClosureArgs } from '@noeldemartin/utils/types';

export const RuntimeErrorClass = runtimeGlobal<typeof globalThis>().Error;

export interface JSErrorOptions {
    cause?: unknown;
}

export default class JSError extends RuntimeErrorClass {

    declare public name: string;
    declare public message: string;
    declare public stack?: string;
    declare public cause?: unknown;

    constructor(message?: string, options?: JSErrorOptions) {
        super(...([message, options] as ClosureArgs));

        // Fix inheritance: https://stackoverflow.com/questions/41102060/typescript-extending-error-class
        this.name = new.target.name === 'JSError' ? 'Error' : new.target.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }

}
