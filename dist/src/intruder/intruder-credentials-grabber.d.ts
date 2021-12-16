export default class IntruderCredentialsGrabber {
    config: any;
    browser: any;
    constructor(config: any, browser: any);
    static init(config: any): Promise<IntruderCredentialsGrabber>;
    getAuthHeaders(username: any, password: any): Promise<any>;
    _getAuthHeadersToken(username: any, password: any): Promise<any>;
    _getAuthHeadersCookie(username: any, password: any): Promise<{}>;
    disconnect(): Promise<any>;
    _extractAuthHeaders(requestHeaders: any): {};
}
