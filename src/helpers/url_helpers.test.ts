import { arrayChunk } from '@/helpers/array_helpers';
import {
    requireUrlDirectoryName,
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

    it('splits arrays into chunks', () => {
        expect(arrayChunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
        expect(arrayChunk([1, 2, 3, 4, 5, 6], 2)).toEqual([[1, 2], [3, 4], [5, 6]]);
        expect(arrayChunk([1, 2, 3, 4, 5, 6], 10)).toEqual([[1, 2, 3, 4, 5, 6]]);
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

    it('resolves urls with non-standard protocols', () => {
        expect(urlResolve('storage://local/path/', 'file')).toEqual('storage://local/path/file');
        expect(urlResolve('storage://local/path/', 'storage://local/another/path/file'))
            .toEqual('storage://local/another/path/file');
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

    it('requires urls', () => {
        expect(() => requireUrlDirectoryName('https://example.org')).toThrowError();
        expect(requireUrlDirectoryName('https://example.org/foobar/')).toEqual('foobar');
    });

});
