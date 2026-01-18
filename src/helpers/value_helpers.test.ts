import { describe, expect, expectTypeOf, it } from 'vitest';

import { isTruthy } from '@noeldemartin/utils/helpers/value_helpers';

describe('Value helpers', () => {

    it('filters truthy values', () => {
        const items = [1, 2, 3, null, 0, '', 'foo'];
        const filteredItems = items.filter(isTruthy);

        expect(filteredItems).toEqual([1, 2, 3, 'foo']);
        expectTypeOf(filteredItems).toEqualTypeOf<(number | string)[]>();
    });

});
