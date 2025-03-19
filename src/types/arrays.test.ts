import { describe, it } from 'vitest';

import { tt } from '@noeldemartin/testing';
import type { Equals, Expect } from '@noeldemartin/testing';

import type { ArrayItem, Tuple } from './arrays';

describe('Array types', () => {

    it(
        'Has correct types',
        tt<
            | Expect<Equals<ArrayItem<string[]>, string>>
            | Expect<Equals<Tuple<string, 3>, [string, string, string]>>
            | Expect<Equals<Tuple<string, 5, 1 | 3>, [string, string | undefined, string, string | undefined, string]>>
            | true
        >(),
    );

});
