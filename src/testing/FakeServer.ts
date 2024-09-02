import FakeResponse from '@/testing/FakeResponse';
import { arrayRemove } from '@/helpers/array_helpers';
import { toString } from '@/helpers/object_helpers';
import type { GetClosureArgs, GetClosureResult } from '@/types/helpers';

export type FetchSpy = (request: FakeServerRequest) => unknown;

export interface FakeServerRequest {
    url: string;
    method: string;
    body: string;
    response?: Response;
}

export interface FakeServerResponse {
    response: Response;
    method?: string;
    times?: number;
}

export default class FakeServer {

    public readonly fetch: typeof fetch;
    protected fetchSpy: FetchSpy | null = null;
    protected requests: FakeServerRequest[] = [];
    protected responses: Record<string, FakeServerResponse[]> = {};

    constructor() {
        const getRequest = (...[input, options]: GetClosureArgs<typeof fetch>): FakeServerRequest => {
            if (typeof input === 'string') {
                return {
                    url: input,
                    method: options?.method ?? 'GET',
                    body: toString(options?.body ?? ''),
                };
            }

            if ('href' in input) {
                return {
                    url: toString(input),
                    method: options?.method ?? 'GET',
                    body: toString(options?.body ?? ''),
                };
            }

            return {
                url: input.url,
                method: input.method,
                body: toString(input.body),
            };
        };

        this.fetch = async (input, options) => {
            const request = getRequest(input, options);
            const response = await this.matchResponse(request);

            request.response = response;
            this.requests.push(request);

            this.fetchSpy?.(request);

            return response;
        };
    }

    public spy(fetchSpy: FetchSpy): void {
        this.fetchSpy = fetchSpy;
    }

    public getRequest(url: string): FakeServerRequest | null;
    public getRequest(method: string, url: string): FakeServerRequest | null;
    public getRequest(methodOrUrl: string, url?: string): FakeServerRequest | null {
        const method = typeof url === 'string' ? methodOrUrl : false;
        url = url ?? methodOrUrl;

        return this.requests.find(request => request.url === url && (!method || request.method === method)) ?? null;
    }

    public getRequests(url?: string): FakeServerRequest[];
    public getRequests(method: string, url: string): FakeServerRequest[];
    public getRequests(methodOrUrl?: string, url?: string): FakeServerRequest[] {
        if (!methodOrUrl) {
            return this.requests;
        }

        const method = typeof url === 'string' ? methodOrUrl : false;
        url = url ?? methodOrUrl;

        return this.requests.filter(request => request.url === url && (!method || request.method === method));
    }

    public respond(url: string, response: Response | FakeServerResponse): void {
        this.responses[url] ??= [];
        this.responses[url]?.push('response' in response ? response : { response });
    }

    public respondOnce(url: string, response: Response): void {
        this.respond(url, { response, times: 1 });
    }

    public reset(): void {
        this.requests = [];
        this.responses = {};
    }

    protected async matchResponse(request: FakeServerRequest): GetClosureResult<typeof fetch> {
        const responses = this.responses[request.url];
        const response = responses?.find(_response => !_response.method || _response.method === request.method);

        if (!responses || !response) {
            return FakeResponse.notFound();
        }

        if (response.times) {
            response.times--;
            response.times === 0 && arrayRemove(responses, response);
        }

        return response.response;
    }

}
