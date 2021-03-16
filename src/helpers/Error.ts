import { runtimeGlobal } from '@/helpers/runtime_helpers';

export default class Error extends runtimeGlobal().Error {

    constructor(message?: string) {
        super(message);

        // Fix inheritance: https://stackoverflow.com/questions/41102060/typescript-extending-error-class
        this.name = new.target.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }

}