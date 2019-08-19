class BaseConfig {
  constructor(configArgs) {
    // Default values:
    this.apiEndpointsFile = "./tmp/api_endpoints.json";
    this.pagesFile = "./tmp/pages.json";
    this.reportPath = "./tmp/report";
    this.buttonXPath = "button";
    this.ignoreButtonsIncluding = [];
    this.ignoreAPIrequestsIncluding = [];

    // A bit hacky, happy for suggestions of a better way to do this...
    Object.keys(configArgs).forEach((key) => {
      this[key] = configArgs[key];
    });
  }

  responseIsAuthorised(status, headers, body) {
    return !(this.unAuthorizedStatusCodes.includes(status));
  }

  ignoreLink(url) {
    let ignore = false;

    this.ignoreLinksIncluding.forEach((ignoreStr) => {
      if(url.includes(ignoreStr)) {
        ignore = true;
      }
    });

    return ignore;
  }

  ignoreApiRequest(url, method) {
    let ignore = false;

    this.ignoreAPIrequestsIncluding.forEach((ignoreStr) => {
      if(url.includes(ignoreStr)) {
        ignore = true;
      }
    });

    return ignore;
  }

  ignoreButton(outerHTML) {
    let ignore = false;

    this.ignoreButtonsIncluding.forEach((ignoreStr) => {
      if(outerHTML.includes(ignoreStr)) {
        ignore = true;
      }
    });

    return ignore;
  }

  async loginFunction(page, username, password){
    await page.goto(this.loginConfig.url);
    await page.waitForSelector(this.loginConfig.usernameXpath);
    await page.waitForSelector(this.loginConfig.passwordXpath);
    await page.waitFor(500);

    await page.type(this.loginConfig.usernameXpath, username);
    await page.type(this.loginConfig.passwordXpath, password);

    await page.tap(this.loginConfig.submitXpath);
    await page.waitFor(1000);

    return;
  }
}

module.exports = BaseConfig;
