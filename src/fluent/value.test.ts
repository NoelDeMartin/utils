import { describe, expect, it } from 'vitest';

import { value } from '@noeldemartin/utils/fluent/value';

describe('Value helper', () => {

    it('works', () => {
        expect(value(true)).toEqual(true);
        expect(value(() => true)).toEqual(true);
    });

});
