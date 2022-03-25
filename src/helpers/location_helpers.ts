export function getLocationQueryParameter(parameter: string): string | undefined {
    return getLocationQueryParameters()[parameter];
}

export function getLocationQueryParameters<T extends string = string>(): Partial<{ [key in T]: string }> {
    const url = new URL(location.href);
    const queryParameters = {} as Record<string, string>;

    url.searchParams.forEach((value, key) => (queryParameters[key] = value));

    return queryParameters as Partial<{ [key in T]: string }>;
}

export function updateLocationQueryParameters(parameters: Record<string, string | undefined>): void {
    const url = Object.entries(parameters).reduce(
        (url, [parameter, value]) => {
            value
                ? url.searchParams.set(parameter, value)
                : url.searchParams.delete(parameter);

            return url;
        },
        new URL(location.href),
    );

    history.pushState(null, document.title, url.href);
}
