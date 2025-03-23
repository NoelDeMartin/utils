export function parseDate(value?: unknown): Date | null {
    if (!value) return null;

    try {
        const date = new Date(value as string | number | Date);
        const time = date.getTime();

        return isNaN(time) || time === 0 ? null : date;
    } catch (error) {
        return null;
    }
}
