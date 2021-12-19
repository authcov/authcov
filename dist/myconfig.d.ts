declare const config: {
    crawlUser: {
        username: string;
        password: string;
    };
    intruders: {
        username: string;
        password: string;
    }[];
    authorisationHeaders: string[];
    baseUrl: string;
    saveResponses: boolean;
    saveScreenshots: boolean;
    clickButtons: boolean;
    buttonXPath: string;
    type: string;
    authenticationType: string;
    maxDepth: number;
    xhrTimeout: number;
    pageTimeout: number;
    verboseOutput: boolean;
    apiEndpointsFile: string;
    pagesFile: string;
    reportPath: string;
    headless: boolean;
    unAuthorizedStatusCodes: number[];
    loginFunction: (page: any, username: any, password: any) => Promise<void>;
    responseIsAuthorised: (status: any, headers: any, body: any) => boolean;
    ignoreLink: (url: any) => boolean;
    ignoreApiRequest: (url: any, method: any) => boolean;
    ignoreButton: (outerHTML: any) => boolean;
};
