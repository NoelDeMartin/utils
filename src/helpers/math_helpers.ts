export function clamp(value: number, min: number, max: number): number {
    return Math.max(Math.min(value, max), min);
}

export function round(value: number, places: number = 0): number {
    const base = 10 ** places;

    return Math.round(value * base) / base;
}
