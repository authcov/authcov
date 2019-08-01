const Browser = require('../crawler/browser.js');

class IntruderCredentialsGrabber {
  constructor(webAppConfig, browser) {
    this.webAppConfig = webAppConfig;
    this.browser = browser;
  }

  static async init(webAppConfig) {
    const browser = await Browser.init();
    const credsGrabber = new IntruderCredentialsGrabber(webAppConfig, browser);
    return credsGrabber;
  }

  async getAuthHeaders(username, password) {
    if(this.webAppConfig.authenticationType == 'token') {
      return this._getAuthHeadersToken(username, password);
    } else if(this.webAppConfig.authenticationType == 'cookie') {
      return this._getAuthHeadersCookie(username, password);
    }
  }

  // TODO:
  async _getAuthHeadersToken(username, password) {
    // If this is using bearer token (header) authorisation then we need to intercept and API request to get the token
    const page = await this.browser.getTab();
    await this.webAppConfig.loginFunction(page, username, password);

    page.on('request', (request) => {
      console.log(`Request to ${request.url()}`);
    });
  }

  async _getAuthHeadersCookie(username, password) {
    const page = await this.browser.getTab();
    await this.webAppConfig.loginFunction(page, username, password);

    const response = await page.goto(this.webAppConfig.baseUrl); // TODO: This goto is probably unecessary
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

    return this._extractAuthHeaders(requestHeaders);
  }

  async disconnect() {
    return this.browser.disconnect();
  }

  _extractAuthHeaders(requestHeaders) {
    const authHeaders = {};
    const headerKeys = Object.keys(requestHeaders);

    // Only select the headers which are also in webAppConfig.authorisationHeaders
    headerKeys.forEach((key) => {
      if(this.webAppConfig.authorisationHeaders.includes(key)) {
        authHeaders[key] = requestHeaders[key];
      }
    });

    return authHeaders;
  }
}

module.exports = IntruderCredentialsGrabber;
