import { describe, it } from 'vitest';

import { tt } from '@noeldemartin/testing';
import type { Equals, Expect } from '@noeldemartin/testing';

import type { DeepKeyOf, DeepValue } from './objects';

interface Post {
    id: number;
    title: string;
    author: {
        id: number;
        name: string;
    };
    related: Post[];
}

describe('Object types', () => {

    it(
        'Has correct types',
        tt<
            | Expect<Equals<DeepKeyOf<Post>, 'id' | 'title' | 'author' | 'author.id' | 'author.name' | 'related'>>
            | Expect<Equals<DeepValue<Post, 'author'>, { id: number; name: string }>>
            | Expect<Equals<DeepValue<Post, 'author.name'>, string>>
            | Expect<Equals<DeepValue<Post, 'related'>, Post[]>>
            | true
        >(),
    );

});
