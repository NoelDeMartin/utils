import { describe, expect, it } from 'vitest';

import { invade } from './invade';

describe('invade', () => {

    it('invades private methods', () => {
        class Vault {

            private getSecret(): string {
                return '42';
            }
        
        }

        expect(invade(new Vault(), ['getSecret']).getSecret()).toBe('42');
    });

});
