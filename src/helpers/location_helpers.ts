import { after } from '@noeldemartin/utils/helpers/time_helpers';

async function waitUrlUpdated(url: string): Promise<void> {
    while (location.href !== url) {
        await after({ ms: 1 });
    }
}

export function getLocationQueryParameter(parameter: string): string | undefined {
    return getLocationQueryParameters()[parameter];
}

export function getLocationQueryParameters<T extends string = string>(): Partial<{ [key in T]: string }> {
    const url = new URL(location.href);
    const queryParameters = {} as Record<string, string>;

    url.searchParams.forEach((value, key) => (queryParameters[key] = value));

    return queryParameters as Partial<{ [key in T]: string }>;
}

export function hasLocationQueryParameter(parameter: string): boolean {
    const url = new URL(location.href);

    return url.searchParams.has(parameter);
}

export async function updateLocationQueryParameters(parameters: Record<string, string | undefined>): Promise<void> {
    const url = Object.entries(parameters).reduce((_url, [parameter, value]) => {
        value ? _url.searchParams.set(parameter, value) : _url.searchParams.delete(parameter);

        return _url;
    }, new URL(location.href));

    history.pushState(null, document.title, url.href);

    await waitUrlUpdated(url.href);
}

export async function deleteLocationQueryParameters(parameters: string[]): Promise<void> {
    const url = parameters.reduce((_url, parameter) => {
        _url.searchParams.delete(parameter);

        return _url;
    }, new URL(location.href));

    history.pushState(null, document.title, url.href);

    await waitUrlUpdated(url.href);
}
