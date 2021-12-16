export default class Browser {
    puppeteer_browser: any;
    puppeteer_context: any;
    maxConcurrency: any;
    pendingRequests: any;
    browserLaunched: any;
    constructor(puppeteer_browser: any, puppeteer_context: any, maxConcurrency: any, browserLaunched: any);
    static init(config: any): Promise<Browser>;
    resetContext(): Promise<void>;
    tabsAvailable(): boolean;
    getTab(): Promise<any>;
    disconnect(): Promise<void>;
}
