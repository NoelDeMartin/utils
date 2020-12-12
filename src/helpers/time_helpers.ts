export interface DebouncedFunction<Args extends ClosureArgs> {
    (...args: Args): void;
    cancel(): void;
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

export function isValidDateString(value: string): boolean {
    if (typeof value !== 'string')
        return false;

    const date = new Date(value);

    return !isNaN(date.getTime());
}

export function after(time: { seconds?: number; ms?: number } = {}): Promise<void> {
    const getTimeInMilliseconds = () => {
        if (time.seconds)
            return time.seconds * 1000;

        return time.ms || 0;
    };

    return new Promise(resolve => setTimeout(resolve, getTimeInMilliseconds()));
}

export function afterAnimationFrame(): Promise<void> {
    return new Promise(resolve => requestAnimationFrame(() => resolve()));
}
