import { value } from '@/fluent/value';

describe('Value helper', () => {

    it('works', () => {
        expect(value(true)).toEqual(true);
        expect(value(() => true)).toEqual(true);
    });

});
