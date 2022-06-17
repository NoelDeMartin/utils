export function parseBoolean(value: unknown): boolean {
    if (!value) {
        return false;
    }

    if ((['0', 'false'] as unknown[]).includes(value)) {
        return false;
    }

    return true;
}
