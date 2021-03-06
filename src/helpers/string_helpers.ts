export function stringReverse(text: string): string {
    return text.split('').reverse().join('');
}

export function stringSplitWords(text: string): string[] {
    return text.split(/_|-|\s|(?=[A-Z])/);
}

export function stringToCamelCase(text: string): string {
    const words = stringSplitWords(text);

    return words[0].toLowerCase()
        + words.slice(1).map(word => word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase()).join('');
}

export function stringToSlug(text: string, separator: string = '-'): string {
    text = text
        .trim()
        .normalize('NFD')
        .replace(/_|-/g, ' ')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\d\w\s]/g, '')
        .toLowerCase()
        .replace(/\s+/g, separator);

    if (separator.length > 0)
        text = text.replace(new RegExp(`${separator}+`, 'g'), separator);

    return text;
}

export function stringToStudlyCase(text: string): string {
    const words = stringSplitWords(text);

    return words.map(word => word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase()).join('');
}
