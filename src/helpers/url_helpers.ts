export interface UrlParts {
    protocol?: string;
    domain?: string;
    port?: string;
    path?: string;
    query?: string;
    fragment?: string;
}

export function urlResolve(...parts: string[]): string {
    let url = parts.shift() as string;

    while (parts.length > 0) {
        const fragment = parts.shift() as string;

        if (fragment.startsWith('/')) {
            url = urlRoot(url) + fragment;
        } else if (fragment.startsWith('http://') || fragment.startsWith('https://')) {
            url = fragment;
        } else if (url.endsWith('/')) {
            url += fragment;
        } else {
            url += '/' + fragment;
        }
    }

    return url;
}

export function urlResolveDirectory(...parts: string[]): string {
    const url = urlResolve(...parts);

    return url.endsWith('/') ? url : (url + '/');
}

export function urlRoot(url: string): string {
    const protocolIndex = url.indexOf('://');
    const pathIndex = url.substr(protocolIndex + 3).indexOf('/');

    return pathIndex !== -1
        ? url.substring(0, protocolIndex + 3 + pathIndex)
        : url;
}

export function urlParentDirectory(url: string): string {
    if (url.endsWith('/')) {
        url = url.substring(0, url.length - 1);
    }

    const pathIndex = url.lastIndexOf('/');

    return pathIndex !== -1 ? url.substr(0, pathIndex + 1) : url;
}

export function urlFilename(url: string): string {
    const pathIndex = url.lastIndexOf('/');

    return pathIndex !== -1 ? url.substr(pathIndex + 1) : '';
}

export function urlParse(url: string): UrlParts | null {
    const match = url.trim().match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);

    if (!match)
        return null;

    const host = match[4] || '';
    const [domain, port]: string[] = host.indexOf(':') === -1 ? [host] : host.split(':');

    return {
        protocol: match[2] || undefined,
        domain: domain || undefined,
        port: port || undefined,
        path: match[5] || undefined,
        query: match[7] || undefined,
        fragment: match[9] || undefined,
    };
}

export function urlClean(url: string, includedParts: { [part in keyof UrlParts]?: boolean }): string {
    const parts = urlParse(url);

    if (!parts)
        return url;

    for (const [part, value] of Object.entries(parts) as [keyof UrlParts, string?][]) {
        parts[part] = includedParts[part] !== false ? value || '' : '';
    }

    return [
        parts.protocol ? `${parts.protocol}://` : '',
        parts.domain ?? '',
        parts.port ? `:${parts.port}` : '',
        parts.path ?? '',
        parts.query ? `?${parts.query}` : '',
        parts.fragment ? `#${parts.fragment}` : '',
    ].join('');
}

export function urlRoute(url: string): string {
    return urlClean(url, {
        protocol: true,
        domain: true,
        port: true,
        path: true,
        query: false,
        fragment: false,
    });
}
