const Browser = require('../crawler/browser.js');
const { PendingXHR } = require('pending-xhr-puppeteer');

class IntruderCredentialsGrabber {
  constructor(config, browser) {
    this.config = config;
    this.browser = browser;
  }

  static async init(config) {
    const browser = await Browser.init();
    const credsGrabber = new IntruderCredentialsGrabber(config, browser);
    return credsGrabber;
  }

  async getAuthHeaders(username, password) {
    if(this.config.options.authenticationType == 'token') {
      return this._getAuthHeadersToken(username, password);
    } else if(this.config.options.authenticationType == 'cookie') {
      return this._getAuthHeadersCookie(username, password);
    }
  }

  async _getAuthHeadersToken(username, password) {
    // If this is using bearer token (header) authorisation then we need to intercept and API request to get the token
    const page = await this.browser.getTab();

    await this.config.loginFunction(page, username, password);

    let url;
    if(this.config.options.tokenTriggeringPage == undefined) {
      url = this.config.options.baseUrl;
    } else {
      url = this.config.options.tokenTriggeringPage;
    }

    let authHeadersFound;

    page.on('request', (request) => {
      const authHeaders = this._extractAuthHeaders(request.headers());

      if(Object.keys(authHeaders).length > 0) {
        authHeadersFound = authHeaders;
      }
    });

    const pendingXHR = new PendingXHR(page);
    await page.goto(url);
    // Wait max 10 seconds for xhrs
    await Promise.race([
      pendingXHR.waitForAllXhrFinished(),
      new Promise(resolve => {
        setTimeout(resolve, 5000);
      }),
    ]);
    await page.close();

    if(authHeadersFound == undefined) {
      throw `Could not find auth headers for user ${username}!`;
    }

    return authHeadersFound;
  }

  async _getAuthHeadersCookie(username, password) {
    const page = await this.browser.getTab();
    await this.config.loginFunction(page, username, password);

    const response = await page.goto(this.config.options.baseUrl); // TODO: This goto is probably unecessary
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

    // Only select the headers which are also in config.options.authorisationHeaders
    headerKeys.forEach((key) => {
      if(this.config.options.authorisationHeaders.includes(key)) {
        authHeaders[key] = requestHeaders[key];
      }
    });

    return authHeaders;
  }
}

module.exports = IntruderCredentialsGrabber;
