export function stringContains(haystack: string, needle: string): boolean {
    return haystack.indexOf(needle) !== -1;
}

export function stringReverse(text: string): string {
    return text.split('').reverse().join('');
}

export function stringUncapitalize(text: string): string {
    if (text.length === 0)
        return text;

    return text.substr(0, 1).toLowerCase() + text.substr(1);
}
