export function compare(a: unknown, b: unknown): 1 | -1 | 0 {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (a as any) > (b as any) ? 1 : ((b as any) > (a as any) ? -1 : 0);
}
