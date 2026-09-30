import { value } from '@noeldemartin/utils/fluent/value';
import { describe, expect, it } from 'vite-plus/test';

describe('Value helper', () => {
    it('works', () => {
        expect(value(true)).toEqual(true);
        expect(value(() => true)).toEqual(true);
    });
});
