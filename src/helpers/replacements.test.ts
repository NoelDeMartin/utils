import { describe, expect, it } from 'vitest';

import { applyReplacements } from './replacements';

describe('Replacements', () => {

    it('Applies replacements', () => {
        expect(applyReplacements('Foo {{bar}}', { bar: 'Bar' })).toEqual('Foo Bar');
        expect(applyReplacements('Foo {{ bar }}', { bar: 'Bar' })).toEqual('Foo Bar');
        expect(applyReplacements('{{ one }}{{ o }}{{ one }}', { one: '1', o: '0' })).toEqual('101');
    });

    it('Evaluates replacements JavaScript', () => {
        expect(applyReplacements('Foo {{ bar || \'Fallback\' }}', { bar: 'Bar' })).toEqual('Foo Bar');
        expect(applyReplacements('Foo {{ bar || \'Bar\' }}')).toEqual('Foo Bar');
        expect(applyReplacements('Foo {{ bar || uuid() }}')).toMatch(
            /Foo [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
        );
        expect(applyReplacements('Now: {{ now() }}')).toEqual(`Now: ${new Date().toISOString()}`);
        expect(applyReplacements('Date: {{ date(\'2024-03-03\') }}')).toEqual('Date: 2024-03-03T00:00:00.000Z');
    });

});
