import { arrayRemove } from './array_helpers';

export type ListenerEvents<TListener extends object> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in keyof TListener]: TListener[K] extends (...args: any[]) => any ? K : never;
}[keyof TListener];

export type ListenerPayload<TListener extends object, TEvent extends keyof TListener> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [K in keyof TListener]: TListener[K] extends (...args: infer TPayload) => any ? TPayload : never;
}[TEvent];

export interface Listeners<Listener extends object> {
    add(listener: Listener): () => void;
    remove(listener: Listener): void;
}

export default class ListenersManager<Listener extends object> implements Listeners<Listener> {

    private listeners: Listener[] = [];

    public add(listener: Listener): () => void {
        this.listeners.push(listener);

        return () => this.remove(listener);
    }

    public remove(listener: Listener): void {
        arrayRemove(this.listeners, listener);
    }

    public async emit<Event extends ListenerEvents<Listener>>(
        event: Event,
        ...payload: ListenerPayload<Listener, Event>
    ): Promise<void> {
        for (const listener of this.listeners) {
            const callback = listener[event];

            if (typeof callback !== 'function') {
                continue;
            }

            await callback?.call(listener, ...payload);
        }
    }

}
