import { describe, expect, it } from 'vitest';

import { md5 } from '@noeldemartin/utils/helpers/hash_helpers';

describe('Hash helpers', () => {

    it('calculates md5 hashes', () => {
        expect(md5('foobar')).toEqual('3858f62230ac3c915f300c664312c63f');
        expect(
            md5(
                [
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed magna dapibus,',
                    'interdum odio eu, condimentum nibh. Donec dapibus condimentum turpis id tincidunt.',
                    'Maecenas at turpis imperdiet, molestie massa id, varius nunc. Sed commodo a quam quis interdum.',
                    'Cras sollicitudin nisl nisi. Donec aliquam non justo in aliquam.',
                    'Vivamus ultrices urna et egestas euismod. Etiam pretium ligula non gravida lacinia.',
                    'Mauris iaculis est a lorem sagittis, et mattis ex convallis.',
                ].join(' '),
            ),
        ).toEqual('e789ad95b7fa0ee666a5c80df0bf1ba1');
    });

});
