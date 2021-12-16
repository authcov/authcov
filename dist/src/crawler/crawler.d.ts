export default class Crawler {
    browser: any;
    events: any;
    linkQueue: any;
    visitedUrls: any;
    _resolveIdle: any;
    currentUser: any;
    apiEndpointData: any;
    pageData: any;
    config: any;
    processEvents: any;
    cookiesStr: any[];
    constructor(browser: any, options: any);
    static init(options: any): Promise<Crawler>;
    close(): Promise<void>;
    onIdle(): Promise<unknown>;
    login(username: any, password: any): Promise<void>;
    logout(): Promise<any>;
    handleRequest(request: any, sourceUrl: any): void;
    handleResponse(response: any, sourceUrl: any): Promise<void>;
    handleDialog(pageUrl: any, currentUser: any, dialog: any): void;
    startCrawling(): Promise<void>;
    crawlPage(url: any, depth: any): Promise<void>;
    processLink(links: any, depth: any): void;
    resolveUrl(url: any, baseUrl: any): any;
    ignoreLink(url: any): any;
    complete(): boolean;
    _verboseLog(message: any): void;
}
