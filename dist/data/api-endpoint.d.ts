import Config from '../config/config';
export default class ApiEndpoint {
    id: string;
    url: string;
    method: string;
    config: Config;
    requests: any[];
    constructor(data: any, config: Config);
    data(): {
        id: string;
        url: string;
        method: string;
        requests: any[];
    };
    aclKey(): {};
    aclKeyRequests(): {};
    accessNumber(): 1 | 0;
    usernamesRequested(): any[];
    firstValidRequest(): any;
    strippedUrl(): RegExpMatchArray;
}
