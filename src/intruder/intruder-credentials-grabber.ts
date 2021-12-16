const Browser = require('../crawler/browser.js');

module.exports = class IntruderCredentialsGrabber {
  config: any;
  browser: any;

  constructor(config, browser) {
    this.config = config;
    this.browser = browser;
  }

  static async init(config) {
    const browser = await Browser.init(config);
    const credsGrabber = new IntruderCredentialsGrabber(config, browser);
    return credsGrabber;
  }

  async getAuthHeaders(username, password) {
    if(this.config.authenticationType == 'token') {
      return this._getAuthHeadersToken(username, password);
    } else if(this.config.authenticationType == 'cookie') {
      return this._getAuthHeadersCookie(username, password);
    }
  }

  async _getAuthHeadersToken(username, password) {
    // If this is using bearer token (header) authorisation then we need to intercept and API request to get the token
    const page = await this.browser.getTab();

    console.log(`Logging in as ${username}...`);
    await this.config.loginFunction(page, username, password);
    console.log(`Logged in.`);

    let url;
    if(this.config.tokenTriggeringPage === undefined) {
      url = this.config.baseUrl;
    } else {
      url = this.config.tokenTriggeringPage;
    }

    let authHeadersFound;

    page.on('request', (request) => {
      const authHeaders = this._extractAuthHeaders(request.headers());

      if(Object.keys(authHeaders).length > 0) {
        authHeadersFound = authHeaders;
      }
    });

    // TODO: Make this wait for api requests to finish

    await page.close();

    if(authHeadersFound == undefined) {
      throw `Could not find auth headers for user ${username}!`;
    }

    return authHeadersFound;
  }

  async _getAuthHeadersCookie(username, password) {
    const page = await this.browser.getTab();
    await this.config.loginFunction(page, username, password);

    let url;
    if(this.config.cookiesTriggeringPage === undefined) {
      url = this.config.baseUrl;
    } else {
      url = this.config.cookiesTriggeringPage;
    }

    const response = await page.goto(url);
    const requestHeaders = response.request().headers();

    // Hack: request.headers() does not include Cookies so we have to manually save them from the login request
    //       and then send them back to apiEndpointData
    const cookies = await page.cookies();
    const cookiesStr = cookies.map((cookie) => { return `${cookie.name}=${cookie.value}`; }).join('; ');

    if(cookies !== null) {
      // TODO: Check case-senstive situations (cookie vs Cookie)
      requestHeaders['cookie'] = cookiesStr;
    }

    await page.close();
    await this.browser.resetContext();

    const authHeadersFound = this._extractAuthHeaders(requestHeaders);
    if(authHeadersFound == undefined) {
      throw `Could not find auth headers for user ${username}!`;
    }

    return authHeadersFound;
  }

  async disconnect() {
    return this.browser.disconnect();
  }

  _extractAuthHeaders(requestHeaders) {
    const authHeaders = {};
    const headerKeys = Object.keys(requestHeaders);

    // Only select the headers which are also in config.authorisationHeaders
    headerKeys.forEach((key) => {
      if(this.config.authorisationHeaders.includes(key)) {
        authHeaders[key] = requestHeaders[key];
      }
    });

    return authHeaders;
  }
}
