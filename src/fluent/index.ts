import FluentString, { FluentStringInstance } from './FluentString';

export function str(value: string = ''): FluentStringInstance<FluentString> {
    return FluentString.create(value);
}

export { tap, Tapped } from './tap';

export {
    default as FluentString,
    FluentStringInstance,
    fluentStringHelpers,
} from './FluentString';

export {
    default as FluentObject,
    FluentHelpers,
    FluentInstance,
    FluentPrimitiveMethods,
    Helper,
    HelperParams,
} from './FluentObject';
