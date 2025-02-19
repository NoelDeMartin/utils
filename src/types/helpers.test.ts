import { tt } from '@/testing/index';
import type { Equals, Expect } from '@/testing/index';

import type { KeyOf, NullableOptional, NullablePartial } from './helpers';

interface User {
    id: number;
    name: string;
    friendIds: number[];
}

describe('Type helpers', () => {

    it('has correct types', tt<
        Expect<Equals<KeyOf<User, string | number>, 'id' | 'name'>> |
        Expect<Equals<NullablePartial<{ foo: string }>, { foo?: string | null | undefined }>> |

        // eslint-disable-next-line max-len
        Expect<Equals<NullableOptional<{ foo: string; bar?: string }>, { foo: string; bar?: string | null | undefined }>> |

        true
    >());

});
