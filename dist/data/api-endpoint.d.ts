import Config from '../config/config';
export declare type HttpResponse = {
    status: number;
    headers: Record<string, string>;
    authorised: boolean;
};
export declare type HttpRequest = {
    id: string;
    user: string;
    headers: Record<string, string>;
    pageUrl: string;
    response?: HttpResponse;
};
export default class ApiEndpoint {
    id: string;
    url: string;
    method: string;
    config: Config;
    requests: HttpRequest[];
    constructor(data: any, config: Config);
    data(): {
        id: string;
        url: string;
        method: string;
        requests: HttpRequest[];
    };
    aclKey(): {};
    aclKeyRequests(): {};
    accessNumber(): 0 | 1;
    usernamesRequested(): string[];
    firstValidRequest(): HttpRequest;
    strippedUrl(): RegExpMatchArray;
}
