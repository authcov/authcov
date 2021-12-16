var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class PageExplorer {
    constructor(page, pageUrl, currentUser, config, pageData) {
        this.page = page;
        // TODO: sometimes pageUrl != page.url() for example www.example.com vs www.example.com/
        this.pageUrl = pageUrl;
        this.currentUser = currentUser;
        this.config = config;
        this.pageData = pageData;
        this.buttonsClicked = [];
    }
    // TODO: Make this click buttons recursively until max depth reached or there are no more buttons to click
    getLinks() {
        return __awaiter(this, void 0, void 0, function* () {
            let links = yield this._scrapeLinks();
            if (this.config.clickButtons !== true) {
                return links;
            }
            // TODO: Move these function definitions outside of getLinks()
            this._verboseLog(`${this.pageUrl} PageExplorer: exposing functions...`);
            yield this.page.exposeFunction('doNotClickButton', (outerHTML) => __awaiter(this, void 0, void 0, function* () {
                if (this.buttonsClicked.includes(outerHTML)) {
                    return true;
                }
                const ignoreButton = this.config.ignoreButton(outerHTML);
                if (ignoreButton === true) {
                    this.pageData.buttonIgnoredCallback(this.pageUrl, outerHTML, this.currentUser);
                }
                return ignoreButton;
            }));
            yield this.page.exposeFunction('buttonClicked', (outerHTML) => {
                this.pageData.buttonClickedCallback(this.pageUrl, outerHTML, this.currentUser);
                this.buttonsClicked.push(outerHTML);
            });
            this._verboseLog(`${this.pageUrl} PageExplorer: clicking buttons...`);
            yield this.page.$$eval(this.config.buttonXPath, this._pageClickButtons);
            this._verboseLog(`${this.pageUrl} PageExplorer: done. Waiting...`);
            yield this.page.waitFor(200); // NOTE: Increasing this to 1sec causes PageExplorer to hang
            this._verboseLog(`${this.pageUrl} PageExplorer: scraping links...`);
            const newLinks = yield this._scrapeLinks();
            this._verboseLog(`${this.pageUrl} PageExplorer: done.`);
            links = links.concat(newLinks);
            const uniqueLinks = [...new Set(links)];
            return uniqueLinks;
        });
    }
    _scrapeLinks() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.page.$$eval('a', links => links.map(link => link.href));
        });
    }
    // Page functions only gets executed inside the browser window context
    _pageClickButtons(buttons) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < buttons.length; i++) {
                let button = buttons[i];
                // @ts-ignore
                const doNotClick = yield doNotClickButton(button.outerHTML);
                if (doNotClick === false) {
                    yield button.click();
                    // @ts-ignore
                    buttonClicked(button.outerHTML);
                }
            }
        });
    }
    _verboseLog(message) {
        if (this.config.verboseOutput === true) {
            console.log(message);
        }
    }
}
module.exports = PageExplorer;
