import { uuid as generateUUID } from '@noeldemartin/utils';

export interface ReplacementsScope {}

export function date(description: string): string {
    return new Date(Date.parse(description)).toISOString();
}

export function now(): string {
    return new Date().toISOString();
}

export function uuid(this: ReplacementsScope): string {
    return generateUUID();
}
