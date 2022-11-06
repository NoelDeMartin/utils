import { tt } from '@/testing/index';
import type { Equals, Expect } from '@/testing/index';

import type { KeyOf } from './helpers';

interface User {
    id: number;
    name: string;
    friendIds: number[];
}

describe('Type helpers', () => {

    it('has correct types', tt<
        Expect<Equals<KeyOf<User, string | number>, 'id' | 'name'>> |
        true
    >());

});
