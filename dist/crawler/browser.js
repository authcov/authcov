var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Puppeteer = require('puppeteer');
module.exports = class Browser {
    constructor(puppeteer_browser, puppeteer_context, maxConcurrency, browserLaunched) {
        this.puppeteer_browser = puppeteer_browser;
        this.puppeteer_context = puppeteer_context;
        this.maxConcurrency = maxConcurrency;
        this.pendingRequests = 0;
        this.browserLaunched = browserLaunched;
    }
    static init(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const maxConcurrency = (config.maxConcurrency !== undefined) ? config.maxConcurrency : 10;
            let puppeteer_browser;
            let browserLaunched;
            if (config.browserURL !== undefined) {
                puppeteer_browser = yield Puppeteer.connect({
                    browserURL: config.browserURL
                });
                browserLaunched = false;
            }
            else if (config.browserWSEndpoint !== undefined) {
                puppeteer_browser = yield Puppeteer.connect({
                    browserWSEndpoint: config.browserWSEndpoint
                });
                browserLaunched = false;
            }
            else {
                puppeteer_browser = yield Puppeteer.launch({
                    headless: config.headless,
                    args: ['--disable-web-security']
                });
                browserLaunched = true;
            }
            const puppeteer_context = yield puppeteer_browser.createIncognitoBrowserContext();
            const browser = new Browser(puppeteer_browser, puppeteer_context, maxConcurrency, browserLaunched);
            return browser;
        });
    }
    resetContext() {
        return __awaiter(this, void 0, void 0, function* () {
            this.puppeteer_context.close();
            this.puppeteer_context = yield this.puppeteer_browser.createIncognitoBrowserContext();
        });
    }
    tabsAvailable() {
        return (this.pendingRequests < this.maxConcurrency);
    }
    getTab() {
        return __awaiter(this, void 0, void 0, function* () {
            const tab = this.puppeteer_context.newPage();
            return tab;
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.browserLaunched === true) {
                yield this.puppeteer_browser.close();
            }
            else {
                yield this.puppeteer_browser.disconnect();
            }
        });
    }
};
