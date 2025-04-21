import { describe, it } from 'vitest';
import { tt } from '@noeldemartin/testing';
import type { Expect } from '@noeldemartin/testing';

import type { Equals } from '@noeldemartin/utils/types';

import ListenersManager from './ListenersManager';
import type { ListenerEvents, ListenerPayload } from './ListenersManager';

interface StubListener {
    onStart(): unknown;
    onUpdate?(progress: number): unknown;
}

const manager = new ListenersManager<StubListener>();

describe('ListenersManager types', () => {
    /* eslint-disable max-len */

    it(
        'has correct types',
        tt<
            | Expect<Equals<ListenerEvents<StubListener>, 'onStart' | 'onUpdate'>>
            | Expect<Equals<ListenerPayload<StubListener, 'onStart'>, []>>
            | Expect<Equals<ListenerPayload<StubListener, 'onUpdate'>, [number]>>
            | Expect<
                  Equals<
                      typeof manager.emit,
                      <E extends 'onStart' | 'onUpdate'>(event: E,
                          ...payload: ListenerPayload<StubListener, E>
                      ) => Promise<void>
                  >
              >
            | true
        >(),
    );

    /* eslint-enable max-len */
});
