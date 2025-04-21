import { describe, it } from 'vitest';
import { tt } from '@noeldemartin/testing';
import type { Expect } from '@noeldemartin/testing';

import type { Equals } from '@noeldemartin/utils/types';

import type { KeyOf, NullableOptional, NullablePartial } from './helpers';

interface User {
    id: number;
    name: string;
    friendIds: number[];
}

describe('Type helpers', () => {

    it(
        'has correct types',
        tt<
            | Expect<Equals<KeyOf<User, string | number>, 'id' | 'name'>>
            | Expect<Equals<NullablePartial<{ foo: string }>, { foo?: string | null | undefined }>>

            // eslint-disable-next-line max-len
            | Expect<
                  Equals<
                      NullableOptional<{ foo: string; bar?: string }>,
                      { foo: string; bar?: string | null | undefined }
                  >
              >
            | true
        >(),
    );

});
