export default class ApiEndpointData {
    config: any;
    apiEndpoints: any[];
    constructor(options: any);
    loadFile(filePath: any): void;
    saveToFile(fileName: any): void;
    urlCrawledCallback(url: any): void;
    findAuthorisationHeadersForUsername(username: any): {};
    findApiRequestsForUsername(username: any): any[];
    findIntrusionRequestsForUsername(username: any, intruderHeaders: any): any[];
    mpaPageResponseCallback(response: any, cookies: any, pageUrl: any, currentUser: any): Promise<void>;
    apiRequestCallback(request: any, cookies: any, pageUrl: any, currentUser: any): void;
    apiResponseCallback(response: any, cookies: any, pageUrl: any, currentUser: any): Promise<void>;
    _findOrCreateApiEndpoint(url: any, method: any): any;
    _verboseLog(message: any): void;
    scanCompleteCallback(): void;
}
