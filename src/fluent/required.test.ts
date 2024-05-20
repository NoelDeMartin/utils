import { required } from './required';

describe('required', () => {

    it('works with instanceof', () => {
        class Foo {}

        expect(required(() => new Foo)).toBeInstanceOf(Foo);
    });

});
