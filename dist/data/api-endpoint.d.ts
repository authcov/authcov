declare class ApiEndpoint {
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
    accessNumber(): 1 | 0;
    usernamesRequested(): any[];
    firstValidRequest(): any;
    strippedUrl(): RegExpMatchArray;
}
