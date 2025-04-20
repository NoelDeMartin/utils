import { describe, it } from 'vitest';

import { tt } from '@noeldemartin/testing';
import type { Equals, Expect } from '@noeldemartin/testing';

import type { DeepKeyOf, DeepValue } from './objects';

interface Post {
    id: number;
    title: string;
    body: string;
    author: {
        id: number;
        name: string;
    };
}

describe('Object types', () => {

    it(
        'Has correct types',
        tt<
            | Expect<Equals<DeepKeyOf<Post>, 'id' | 'title' | 'body' | 'author' | 'author.id' | 'author.name'>>
            | Expect<Equals<DeepValue<Post, 'author'>, { id: number; name: string }>>
            | Expect<Equals<DeepValue<Post, 'author.name'>, string>>
            | true
        >(),
    );

});
