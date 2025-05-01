import { fail } from './error_helpers';

export interface UrlParts {
    protocol?: string;
    domain?: string;
    port?: string;
    path?: string;
    query?: string;
    fragment?: string;
}

export function requireUrlParentDirectory(url: string): string {
    return urlParentDirectory(url) ?? fail(`Failed getting parent directory from '${url}'`);
}

export function requireUrlDirectoryName(url: string): string {
    return urlDirectoryName(url) ?? fail(`Failed getting directory name from '${url}'`);
}

export function requireUrlParse(url: string): UrlParts {
    return urlParse(url) ?? fail(`Failed parsing url from '${url}'`);
}

export function urlResolve(...parts: string[]): string {
    let url = parts.shift() as string;

    while (parts.length > 0) {
        const fragment = parts.shift() as string;

        if (fragment.startsWith('/')) {
            url = urlRoot(url) + fragment;
        } else if (fragment.match(/^[\w-]+:\/\//)) {
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

    return url.endsWith('/') ? url : url + '/';
}

export function urlRoot(url: string): string {
    const protocolIndex = url.indexOf('://') + 3;
    const pathIndex = url.substr(protocolIndex).indexOf('/');

    return pathIndex !== -1 ? url.substring(0, protocolIndex + pathIndex) : url;
}

export function urlParentDirectory(url: string): string | null {
    if (url.endsWith('/')) url = url.substring(0, url.length - 1);

    if (urlRoot(url) === url) return null;

    const pathIndex = url.lastIndexOf('/');

    return pathIndex !== -1 ? url.substr(0, pathIndex + 1) : null;
}

export function urlDirectoryName(url: string): string | null {
    if (!url.endsWith('/')) url = urlParentDirectory(url) ?? url + '/';

    const rootPathUrl = url.slice(0, -1);

    if (urlRoot(url) === rootPathUrl) return null;

    return urlFileName(rootPathUrl);
}

export function urlFileName(url: string): string {
    const pathIndex = url.lastIndexOf('/');
    const fileName = pathIndex !== -1 ? url.slice(pathIndex + 1) : '';

    return fileName.replace(/#.*$/, '').replace(/\?.*$/, '');
}

export function urlParse(url: string): UrlParts | null {
    const match = url.trim().match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/);

    if (!match) return null;

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

    if (!parts) return url;

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
