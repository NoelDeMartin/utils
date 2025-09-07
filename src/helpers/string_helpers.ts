import type { ArrayItem, Branded, Tuple } from '@noeldemartin/utils/types';

export type Slug = Branded<string, 'slug'>;

export function stringCapitalize(text: string): string {
    return text[0]?.toUpperCase() + text.slice(1);
}

export function stringExcerpt(text: string, maxLength: number = 300, filler: string = '...'): string {
    if (text.length < maxLength) return text;

    return text.substring(0, maxLength - filler.length) + filler;
}

export function stringMatch<Length extends number, Optional extends number = number>(
    text: string,
    pattern: RegExp,
): Tuple<ArrayItem<RegExpMatchArray>, Length, Optional> | null {
    return text.match(pattern) as Tuple<ArrayItem<RegExpMatchArray>, Length, Optional> | null;
}

export function stringMatchAll<Length extends number, Optional extends number = number>(
    text: string,
    pattern: RegExp,
): IterableIterator<Tuple<ArrayItem<RegExpMatchArray>, Length, Optional>> {
    return text.matchAll(pattern) as IterableIterator<Tuple<ArrayItem<RegExpMatchArray>, Length, Optional>>;
}

export function stringReverse(text: string): string {
    return text.split('').reverse().join('');
}

export function stringSplitWords(text: string): string[] {
    return text.split(/_|-|\s|(?=[A-Z])/);
}

export function stringToCamelCase(text: string): string {
    const [firstWord, ...otherWords] = stringSplitWords(text);

    return (
        (firstWord ?? '').toLowerCase() +
        otherWords.map((word) => word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase()).join('')
    );
}

export function stringToSlug(text: string, separator: string = '-'): Slug {
    text = text
        .normalize('NFD')
        .replace(/[֊־᐀‐‑‒–—―⸗⸚⸺⸻~〜〰゠︱︲﹘﹣－(){}><[\]]/g, ' ')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
        .replace(/[\u3000-\u303f]/g, '') // Remove punctuation
        .replace(/['".,#!$%/\\^&*;:=`@+?]/g, '') // Remove special characters
        .toLowerCase()
        .trim()
        .replace(/\s+/g, separator);

    if (separator.length > 0) {
        text = text.replace(new RegExp(`${separator}+`, 'g'), separator);
    }

    return text;
}

export function stringToStudlyCase(text: string): string {
    const words = stringSplitWords(text);

    return words.map((word) => word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase()).join('');
}

export function stringToTitleCase(text: string): string {
    const words = stringSplitWords(text);

    return words.map((word) => word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

export function stringTrimmed(text: string): string {
    return text.trim();
}
