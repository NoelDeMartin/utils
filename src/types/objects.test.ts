import { describe, it } from 'vitest';
import { tt } from '@noeldemartin/testing';
import type { Expect } from '@noeldemartin/testing';

import { arraySorted } from '@noeldemartin/utils/helpers';
import type { Equals } from '@noeldemartin/utils/types';

import type { DeepKeyOf, DeepValue } from './objects';

interface Post {
    id: number;
    title: string;
    author: {
        id: number;
        name: string;
    };
    related?: Post;
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

const posts = [] as Post[];
const key = 'author' as DeepKeyOf<Post>;
const sortedFields = arraySorted(posts, key);

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
                      | 'categories'
                      | 'deep'
                      | 'deep.one'
                      | 'deep.one.two'
                      | 'related'
                      | 'related.id'
                      | 'related.title'
                      | 'related.author'
                      | 'related.author.id'
                      | 'related.author.name'
                      | 'related.categories'
                      | 'related.deep'
                      | 'related.deep.one'
                      | 'related.related'
                      | 'related.related.id'
                      | 'related.related.title'
                      | 'related.related.author'
                      | 'related.related.categories'
                      | 'related.related.deep'
                      | 'related.related.related'
                  >
              >
            | Expect<Equals<DeepValue<Post, 'author'>, { id: number; name: string }>>
            | Expect<Equals<DeepValue<Post, 'author.name'>, string>>
            | Expect<Equals<DeepValue<Post, 'related'>, Post | undefined>>
            | Expect<Equals<DeepValue<Post, 'categories'>, { id: string }[] | undefined>>
            | Expect<Equals<typeof sortedFields, Post[]>>
            | true
        >(),
    );

});
