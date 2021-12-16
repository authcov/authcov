var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Crawler = require('./crawler.js');
module.exports = class UsersCrawler {
    constructor(config, apiEndpointData, pageData, reporter) {
        this.config = config;
        this.apiEndpointData = apiEndpointData;
        this.pageData = pageData;
        this.reporter = reporter;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.reporter._clearReportDir();
            this.reporter._createReportDir();
            const startTime = Date.now();
            yield this.crawlUser(this.config.crawlUser.username, this.config.crawlUser.password);
            this.apiEndpointData.saveToFile(this.config.apiEndpointsFile);
            this.pageData.saveToFile(this.config.pagesFile);
            const diff = (Date.now() - startTime) / 1000;
            console.log(`Finished crawling in ${diff} sec`);
            return;
        });
    }
    crawlUser(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const crawler = yield Crawler.init({
                apiEndpointData: this.apiEndpointData,
                pageData: this.pageData,
                config: this.config
            });
            if (username != 'Public' && password != null) {
                yield crawler.login(username, password);
            }
            yield crawler.startCrawling();
            yield crawler.onIdle();
            yield crawler.close();
            return;
        });
    }
};
