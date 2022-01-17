export type User = {
  username: string;
  password?: string;
}

export default class Config {
  baseUrl: string;
  apiEndpointsFile?: string;
  pagesFile?: string;
  reportPath?: string;
  buttonXPath?: string;
  ignoreButtonsIncluding?: string[];
  ignoreAPIrequestsIncluding?: string[];
  unAuthorizedStatusCodes: number[];
  ignoreLinksIncluding: string[];
  loginConfig: any;
  crawlUser: User;
  intruders: User[];
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
  browserURL?: string;
  maxConcurrency?: number;
  browserWSEndpoint?: string;
  cookiesTriggeringPage?: string;
  tokenTriggeringPage?: string;

  constructor(configArgs: Record<string,any>) {
    // Default values:
    this.apiEndpointsFile = "./api_endpoints.json";
    this.pagesFile = "./pages.json";
    this.reportPath = "./report";
    this.buttonXPath = "button";
    this.ignoreButtonsIncluding = [];
    this.ignoreAPIrequestsIncluding = [];

    // A bit hacky, happy for suggestions of a better way to do this...
    Object.keys(configArgs).forEach((key) => {
      this[key] = configArgs[key];
    });
  }

  responseIsAuthorised(status: number, headers, body): boolean {
    return !(this.unAuthorizedStatusCodes.includes(status));
  }

  ignoreLink(url): boolean {
    let ignore = false;

    this.ignoreLinksIncluding.forEach((ignoreStr) => {
      if(url.includes(ignoreStr)) {
        ignore = true;
      }
    });

    return ignore;
  }

  ignoreApiRequest(url, method): boolean {
    let ignore = false;

    this.ignoreAPIrequestsIncluding.forEach((ignoreStr) => {
      if(url.includes(ignoreStr)) {
        ignore = true;
      }
    });

    return ignore;
  }

  ignoreButton(outerHTML): boolean {
    let ignore = false;

    this.ignoreButtonsIncluding.forEach((ignoreStr) => {
      if(outerHTML.includes(ignoreStr)) {
        ignore = true;
      }
    });

    return ignore;
  }

  async loginFunction(page, username, password): Promise<void> {
    await page.goto(this.loginConfig.url);
    await page.waitForSelector(this.loginConfig.usernameXpath);
    await page.waitForSelector(this.loginConfig.passwordXpath);
    await page.waitForTimeout(500);

    await page.type(this.loginConfig.usernameXpath, username);
    await page.type(this.loginConfig.passwordXpath, password);

    await page.tap(this.loginConfig.submitXpath);
    await page.waitForTimeout(1000);

    return;
  }
}
