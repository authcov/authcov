export default class PageEventsHandler {
    page: any;
    promise: any[];
    pendingRequests: Set<any>;
    promises: Promise<any>[];
    constructor(page: any);
    waitForRequestsToFinish(timeoutSeconds: any): Promise<unknown>;
    _handleRequest(request: any): void;
    _handleRequestFailed(request: any): void;
    _handleRequestfinished(request: any): void;
    waitForAllXhrFinished(): Promise<void>;
    _isXhr(request: any): boolean;
}
