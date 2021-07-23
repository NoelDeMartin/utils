import {
    urlClean,
    urlDirectoryName,
    urlParentDirectory,
    urlParse,
    urlResolve,
    urlResolveDirectory,
    urlRoot,
} from './url_helpers';

describe('Url helper', () => {

    it('uses root when resolving absolute paths', () => {
        expect(urlResolve('http://example.com/something/else', '/foobar'))
            .toEqual('http://example.com/foobar');
    });

    it('uses new domains when resolving different domains', () => {
        expect(urlResolve('http://example.com', 'http://somethingelse.com/foobar'))
            .toEqual('http://somethingelse.com/foobar');
    });

    it('resolves directory adding paths', () => {
        expect(urlResolveDirectory('http://example.com', 'foobar')).toEqual('http://example.com/foobar/');
    });

    it('resolves directory for existing directory', () => {
        expect(urlResolveDirectory('http://example.com/foobar/')).toEqual('http://example.com/foobar/');
    });

    it('resolves parent directories', () => {
        expect(urlParentDirectory('http://example.com/foo/bar')).toEqual('http://example.com/foo/');
        expect(urlParentDirectory('http://example.com/foo/bar/')).toEqual('http://example.com/foo/');
        expect(urlParentDirectory('http://example.com/')).toBeNull();
    });

    it('gets directory names', () => {
        expect(urlDirectoryName('https://example.com/path/to/directory/')).toEqual('directory');
        expect(urlDirectoryName('https://example.com/path/to/directory/file')).toEqual('directory');
        expect(urlDirectoryName('https://example.com')).toBeNull();
    });

    it('gets url roots', () => {
        expect(urlRoot('https://example.com:8000/foo')).toEqual('https://example.com:8000');
        expect(urlRoot('https://example.com/foo')).toEqual('https://example.com');
        expect(urlRoot('https://example.com')).toEqual('https://example.com');
    });

    it('parses standard urls', () => {
        expect(urlParse('https://my.subdomain.com/path/?query=search#hash')).toEqual({
            protocol: 'https',
            domain: 'my.subdomain.com',
            path: '/path/',
            query: 'query=search',
            fragment: 'hash',
        });
    });

    it('parses domains without TLD', () => {
        expect(urlParse('ftp://localhost/nested/path')).toEqual({
            protocol: 'ftp',
            domain: 'localhost',
            path: '/nested/path',
        });
    });

    it('parses ips', () => {
        expect(urlParse('http://192.168.1.157:8080/')).toEqual({
            protocol: 'http',
            domain: '192.168.1.157',
            port: '8080',
            path: '/',
        });
    });

    it('cleans parts', () => {
        expect(
            urlClean(
                'http://example.com/path/?query=search#myhash',
                {
                    path: false,
                    fragment: false,
                },
            ),
        )
            .toEqual('http://example.com?query=search');
    });

});
