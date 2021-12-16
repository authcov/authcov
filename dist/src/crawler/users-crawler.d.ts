export default class UsersCrawler {
    config: any;
    apiEndpointData: any;
    pageData: any;
    reporter: any;
    constructor(config: any, apiEndpointData: any, pageData: any, reporter: any);
    start(): Promise<void>;
    crawlUser(username: any, password: any): Promise<void>;
}
