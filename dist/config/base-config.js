var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = class BaseConfig {
    constructor(configArgs) {
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
    responseIsAuthorised(status, headers, body) {
        return !(this.unAuthorizedStatusCodes.includes(status));
    }
    ignoreLink(url) {
        let ignore = false;
        this.ignoreLinksIncluding.forEach((ignoreStr) => {
            if (url.includes(ignoreStr)) {
                ignore = true;
            }
        });
        return ignore;
    }
    ignoreApiRequest(url, method) {
        let ignore = false;
        this.ignoreAPIrequestsIncluding.forEach((ignoreStr) => {
            if (url.includes(ignoreStr)) {
                ignore = true;
            }
        });
        return ignore;
    }
    ignoreButton(outerHTML) {
        let ignore = false;
        this.ignoreButtonsIncluding.forEach((ignoreStr) => {
            if (outerHTML.includes(ignoreStr)) {
                ignore = true;
            }
        });
        return ignore;
    }
    loginFunction(page, username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield page.goto(this.loginConfig.url);
            yield page.waitForSelector(this.loginConfig.usernameXpath);
            yield page.waitForSelector(this.loginConfig.passwordXpath);
            yield page.waitFor(500);
            yield page.type(this.loginConfig.usernameXpath, username);
            yield page.type(this.loginConfig.passwordXpath, password);
            yield page.tap(this.loginConfig.submitXpath);
            yield page.waitFor(1000);
            return;
        });
    }
};
