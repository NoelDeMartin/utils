import FluentArray from './FluentArray';
import FluentString from './FluentString';
import { fluent } from './index';

describe('Fluency', () => {

    it('creates fluent objects', () => {
        expect(fluent([42])).toBeInstanceOf(FluentArray);
        expect(fluent('foobar')).toBeInstanceOf(FluentString);
    });

});
