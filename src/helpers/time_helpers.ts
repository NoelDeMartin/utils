import type { ClosureArgs } from '@noeldemartin/utils/types';

export interface DebouncedFunction<Args extends ClosureArgs> {
    (...args: Args): void;
    cancel(): void;
}

export interface AfterOptions {
    ms?: number;
    milliseconds?: number;
    s?: number;
    seconds?: number;
}

export function after(ms: number): Promise<void>;
export function after(options?: AfterOptions): Promise<void>;
export function after(msOrOptions: number | AfterOptions = {}): Promise<void> {
    const time =
        typeof msOrOptions === 'number'
            ? msOrOptions
            : (msOrOptions.milliseconds || msOrOptions.ms || 0) + (msOrOptions.seconds || 0) * 1000;

    return new Promise((resolve) => setTimeout(resolve, time));
}

export function afterAnimationFrame(): Promise<void> {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

export function debounce<Args extends ClosureArgs>(
    callback: (...args: Args) => unknown,
    delay: number,
): DebouncedFunction<Args> {
    let timeout: unknown;

    const debouncedCallback: DebouncedFunction<Args> = (...args: Args) => {
        debouncedCallback.cancel();
        timeout = setTimeout(() => callback(...args), delay);
    };

    debouncedCallback.cancel = () => clearTimeout(timeout as number);

    return debouncedCallback;
}

export async function forever(): Promise<void> {
    await new Promise(() => {
        // Nothing to do here.
    });
}

export function isValidDateString(value: string): boolean {
    if (typeof value !== 'string') return false;

    const date = new Date(value);

    return !isNaN(date.getTime());
}

export function seconds(time?: Date | number, round: boolean = false): number {
    if (typeof time === 'undefined') {
        return seconds(Date.now(), round);
    } else if (typeof time === 'number') {
        time = time / 1000;
        return round ? Math.round(time) : time;
    } else {
        return seconds(time.getTime(), round);
    }
}
