var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Browser = require('../crawler/browser.js');
module.exports = class IntruderCredentialsGrabber {
    constructor(config, browser) {
        this.config = config;
        this.browser = browser;
    }
    static init(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const browser = yield Browser.init(config);
            const credsGrabber = new IntruderCredentialsGrabber(config, browser);
            return credsGrabber;
        });
    }
    getAuthHeaders(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.config.authenticationType == 'token') {
                return this._getAuthHeadersToken(username, password);
            }
            else if (this.config.authenticationType == 'cookie') {
                return this._getAuthHeadersCookie(username, password);
            }
        });
    }
    _getAuthHeadersToken(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // If this is using bearer token (header) authorisation then we need to intercept and API request to get the token
            const page = yield this.browser.getTab();
            console.log(`Logging in as ${username}...`);
            yield this.config.loginFunction(page, username, password);
            console.log(`Logged in.`);
            let url;
            if (this.config.tokenTriggeringPage === undefined) {
                url = this.config.baseUrl;
            }
            else {
                url = this.config.tokenTriggeringPage;
            }
            let authHeadersFound;
            page.on('request', (request) => {
                const authHeaders = this._extractAuthHeaders(request.headers());
                if (Object.keys(authHeaders).length > 0) {
                    authHeadersFound = authHeaders;
                }
            });
            // TODO: Make this wait for api requests to finish
            yield page.close();
            if (authHeadersFound == undefined) {
                throw `Could not find auth headers for user ${username}!`;
            }
            return authHeadersFound;
        });
    }
    _getAuthHeadersCookie(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield this.browser.getTab();
            yield this.config.loginFunction(page, username, password);
            let url;
            if (this.config.cookiesTriggeringPage === undefined) {
                url = this.config.baseUrl;
            }
            else {
                url = this.config.cookiesTriggeringPage;
            }
            const response = yield page.goto(url);
            const requestHeaders = response.request().headers();
            // Hack: request.headers() does not include Cookies so we have to manually save them from the login request
            //       and then send them back to apiEndpointData
            const cookies = yield page.cookies();
            const cookiesStr = cookies.map((cookie) => { return `${cookie.name}=${cookie.value}`; }).join('; ');
            if (cookies !== null) {
                // TODO: Check case-senstive situations (cookie vs Cookie)
                requestHeaders['cookie'] = cookiesStr;
            }
            yield page.close();
            yield this.browser.resetContext();
            const authHeadersFound = this._extractAuthHeaders(requestHeaders);
            if (authHeadersFound == undefined) {
                throw `Could not find auth headers for user ${username}!`;
            }
            return authHeadersFound;
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.browser.disconnect();
        });
    }
    _extractAuthHeaders(requestHeaders) {
        const authHeaders = {};
        const headerKeys = Object.keys(requestHeaders);
        // Only select the headers which are also in config.authorisationHeaders
        headerKeys.forEach((key) => {
            if (this.config.authorisationHeaders.includes(key)) {
                authHeaders[key] = requestHeaders[key];
            }
        });
        return authHeaders;
    }
};
