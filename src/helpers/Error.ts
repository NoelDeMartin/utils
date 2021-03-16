import { runtimeGlobal } from '@/helpers/runtime_helpers';

const BaseError = runtimeGlobal().Error;

class Error extends BaseError {

    constructor(message?: string) {
        super(message);

        // Fix inheritance: https://stackoverflow.com/questions/41102060/typescript-extending-error-class
        this.name = new.target.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }

}

export default Error as typeof BaseError;
