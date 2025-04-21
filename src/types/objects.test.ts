import { describe, it } from 'vitest';
import { tt } from '@noeldemartin/testing';
import type { Expect } from '@noeldemartin/testing';

import type { Equals } from '@noeldemartin/utils/types';

import type { DeepKeyOf, DeepValue } from './objects';

interface Post {
    id: number;
    title: string;
    author: {
        id: number;
        name: string;
    };
    related: Post[];
    categories?: { id: string }[];
    deep: {
        one: {
            two: {
                three: {
                    four: string;
                };
            };
        };
    };
    publish(): void;
}

describe('Object types', () => {

    it(
        'Has correct types',
        tt<
            | Expect<
                  Equals<
                      DeepKeyOf<Post>,
                      | 'id'
                      | 'title'
                      | 'author'
                      | 'author.id'
                      | 'author.name'
                      | 'related'
                      | 'categories'
                      | 'deep'
                      | 'deep.one'
                      | 'deep.one.two'
                  >
              >
            | Expect<Equals<DeepValue<Post, 'author'>, { id: number; name: string }>>
            | Expect<Equals<DeepValue<Post, 'author.name'>, string>>
            | Expect<Equals<DeepValue<Post, 'related'>, Post[]>>
            | Expect<Equals<DeepValue<Post, 'categories'>, { id: string }[] | undefined>>
            | true
        >(),
    );

});
