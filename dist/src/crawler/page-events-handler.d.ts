import { Page as PupPage, HTTPRequest } from 'puppeteer';
interface HTTPRequestWithResolver extends HTTPRequest {
    resolver: Function;
}
export default class PageEventsHandler {
    page: PupPage;
    pendingRequests: Set<HTTPRequestWithResolver>;
    promises: Promise<any>[];
    constructor(page: PupPage);
    waitForRequestsToFinish(timeoutSeconds: any): Promise<unknown>;
    _handleRequest(request: HTTPRequestWithResolver): void;
    _handleRequestFailed(request: HTTPRequestWithResolver): void;
    _handleRequestfinished(request: HTTPRequestWithResolver): void;
    waitForAllXhrFinished(): Promise<void>;
    _isXhr(request: any): boolean;
}
export {};
