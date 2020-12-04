export function stringReverse(text: string): string {
    return text.split('').reverse().join('');
}

export function stringToCamelCase(text: string): string {
    return text
        .split(/_|\s|(?=[A-Z])/)
        .map(
            (word, index) => {
                if (word.length === 0)
                    return word;

                if (index === 0)
                    return word.toLowerCase();

                return word.substr(0, 1).toUpperCase() + word.substr(1).toLowerCase();
            },
        )
        .join('');
}

export function stringToSlug(text: string, separator: string = '-'): string {
    text = text
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\d\w\s]/g, '')
        .toLowerCase()
        .replace(/\s+/g, separator);

    if (separator.length > 0)
        text = text.replace(new RegExp(`${separator}+`, 'g'), separator);

    return text;
}

export function stringToStudlyCase(text: string): string {
    return text
        .split(/_|\s/)
        .map(
            word =>
                word.length > 0
                    ? word.substr(0, 1).toUpperCase() + word.substr(1)
                    : word,
        )
        .join('');
}
