export default class ApiEndpoint {
    id: string;
    url: string;
    method: string;
    config: any;
    requests: any[];
    constructor(data: any, config: any);
    data(): {
        id: string;
        url: string;
        method: string;
        requests: any[];
    };
    aclKey(): {};
    aclKeyRequests(): {};
    accessNumber(): 0 | 1;
    usernamesRequested(): any[];
    firstValidRequest(): any;
    strippedUrl(): RegExpMatchArray;
}
