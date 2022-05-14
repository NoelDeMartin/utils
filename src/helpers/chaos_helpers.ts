export function randomInt(): number;
export function randomInt(max: number): number;
export function randomInt(min: number, max: number): number;
export function randomInt(minOrMax?: number, max?: number): number {
    const maxProvided = typeof max === 'number';
    const min = maxProvided ? minOrMax as number : 0;
    max = maxProvided ? max as number : (minOrMax ?? Number.MAX_SAFE_INTEGER);

    return Math.round(Math.random() * (max - min) + min);
}
