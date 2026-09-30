import { tt } from '@noeldemartin/testing';
import type { Expect } from '@noeldemartin/testing';
import type { Equals } from '@noeldemartin/utils/types';
import { describe, it } from 'vite-plus/test';

import ListenersManager from './ListenersManager';
import type { ListenerEvents, ListenerPayload } from './ListenersManager';

interface StubListener {
    onStart(): unknown;
    onUpdate?(progress: number): unknown;
}

const manager = new ListenersManager<StubListener>();

describe('ListenersManager types', () => {
    it(
        'has correct types',
        tt<
            | Expect<Equals<ListenerEvents<StubListener>, 'onStart' | 'onUpdate'>>
            | Expect<Equals<ListenerPayload<StubListener, 'onStart'>, []>>
            | Expect<Equals<ListenerPayload<StubListener, 'onUpdate'>, [number]>>
            | Expect<
                  Equals<
                      typeof manager.emit,
                      <E extends 'onStart' | 'onUpdate'>(
                          event: E,
                          ...payload: ListenerPayload<StubListener, E>
                      ) => Promise<void>
                  >
              >
            | true
        >(),
    );
});
