import ApiEndpoint from './api-endpoint';
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
export default class ApiEndpointData {
    config: Config;
    apiEndpoints: ApiEndpoint[];
    constructor(config: Config);
    loadFile(filePath: any): void;
    saveToFile(fileName: any): void;
    urlCrawledCallback(url: any): void;
    findAuthorisationHeadersForUsername(username: any): {};
    findApiRequestsForUsername(username: any): any[];
    findIntrusionRequestsForUsername(username: any, intruderHeaders: any): any[];
    mpaPageResponseCallback(response: any, cookies: any, pageUrl: any, currentUser: any): Promise<void>;
    apiRequestCallback(request: any, cookies: any, pageUrl: any, currentUser: any): void;
    apiResponseCallback(response: any, cookies: any, pageUrl: any, currentUser: any): Promise<void>;
    _findOrCreateApiEndpoint(url: any, method: any): ApiEndpoint;
    _verboseLog(message: any): void;
    scanCompleteCallback(): void;
}
