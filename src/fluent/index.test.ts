import { tt } from '@noeldemartin/testing';
import type { Expect } from '@noeldemartin/testing';
import type { Equals } from '@noeldemartin/utils/types';
import { describe, expect, it } from 'vite-plus/test';

import FluentArrayDefinition from './FluentArray';
import type { FluentArray } from './FluentArray';
import FluentStringDefinition from './FluentString';
import type { FluentString } from './FluentString';
import { arr, fluent, pull, str } from './index';

describe('Fluency', () => {
    it('creates fluent objects', () => {
        expect(fluent([42])).toBeInstanceOf(FluentArrayDefinition);
        expect(fluent('foobar')).toBeInstanceOf(FluentStringDefinition);
    });
});

describe('Fluency types', () => {
    it('has correct types', () => {
        const fluentStringArray = arr(['foo', 'bar']);
        const fluentNumbersArray = arr([42]);
        const fluentString = str('foobar');
        const objectValue = pull({ foo: 'bar' }, 'foo');

        tt<
            | Expect<Equals<typeof fluentStringArray, FluentArray<string>>>
            | Expect<Equals<typeof fluentNumbersArray, FluentArray<number>>>
            | Expect<Equals<typeof fluentString, FluentString>>
            | Expect<Equals<typeof objectValue, string>>
            | true
        >();
    });
});
