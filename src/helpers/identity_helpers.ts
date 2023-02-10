// Obtained from https://gist.github.com/jed/982883
function randomHexadecimalDigit(seed: string): string {
    const s = seed as unknown as number;

    return (s ^ Math.random() * 16 >> s / 4).toString(16);
}

export function shortId(length: number = 9): string {
    return (10 ** (length - 1)).toString().replace(/[01]/g, randomHexadecimalDigit);
}

export function uuid(): string {
    return ('' + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, randomHexadecimalDigit);
}
