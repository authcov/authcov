export default class BaseConfig {
    apiEndpointsFile: string;
    pagesFile: string;
    reportPath: string;
    buttonXPath: string;
    ignoreButtonsIncluding: string[];
    ignoreAPIrequestsIncluding: string[];
    unAuthorizedStatusCodes: string[];
    ignoreLinksIncluding: string[];
    loginConfig: any;
    crawlUser: any;
    constructor(configArgs: any);
    responseIsAuthorised(status: any, headers: any, body: any): boolean;
    ignoreLink(url: any): boolean;
    ignoreApiRequest(url: any, method: any): boolean;
    ignoreButton(outerHTML: any): boolean;
    loginFunction(page: any, username: any, password: any): Promise<void>;
}
