import { describe, expect, it } from 'vitest';
import { tt } from '@noeldemartin/testing';
import type { Expect } from '@noeldemartin/testing';

import type { Equals } from '@noeldemartin/utils/types';

import { arr, fluent, pull, str } from './index';
import FluentArrayDefinition from './FluentArray';
import FluentStringDefinition from './FluentString';
import type { FluentArray } from './FluentArray';
import type { FluentString } from './FluentString';

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
