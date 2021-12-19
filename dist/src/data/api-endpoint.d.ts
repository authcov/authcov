import Config from '../config/config';
import { HttpRequest } from './api-endpoint-data';
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
