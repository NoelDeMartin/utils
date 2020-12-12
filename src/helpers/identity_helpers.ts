// Obtained from https://gist.github.com/jed/982883
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateUUID(placeholder?: any): string {
    return placeholder
        ? (placeholder ^ Math.random() * 16 >> placeholder / 4).toString(16)
        : ('' + 1e7 + -1e3 + -4e3 + -8e3 + -1e11)
            .replace(/[018]/g, generateUUID);
}

export function uuid(): string {
    return generateUUID();
}
