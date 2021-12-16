declare const config: {
    baseUrl: string;
    crawlUser: {
        username: string;
        password: string;
    };
    intruders: {
        username: string;
        password: string;
    }[];
    type: string;
    authenticationType: string;
    authorisationHeaders: string[];
    maxDepth: number;
    verboseOutput: boolean;
    saveResponses: boolean;
    saveScreenshots: boolean;
    clickButtons: boolean;
    xhrTimeout: number;
    pageTimeout: number;
    headless: boolean;
    unAuthorizedStatusCodes: number[];
    ignoreLinksIncluding: string[];
    ignoreAPIrequestsIncluding: string[];
    ignoreButtonsIncluding: string[];
    loginConfig: {
        url: string;
        usernameXpath: string;
        passwordXpath: string;
        submitXpath: string;
    };
};
