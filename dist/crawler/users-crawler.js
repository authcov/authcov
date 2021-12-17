import Crawler from './crawler';
export default class UsersCrawler {
    constructor(config, apiEndpointData, pageData, reporter) {
        this.config = config;
        this.apiEndpointData = apiEndpointData;
        this.pageData = pageData;
        this.reporter = reporter;
    }
    async start() {
        this.reporter._clearReportDir();
        this.reporter._createReportDir();
        const startTime = Date.now();
        await this.crawlUser(this.config.crawlUser.username, this.config.crawlUser.password);
        this.apiEndpointData.saveToFile(this.config.apiEndpointsFile);
        this.pageData.saveToFile(this.config.pagesFile);
        const diff = (Date.now() - startTime) / 1000;
        console.log(`Finished crawling in ${diff} sec`);
        return;
    }
    async crawlUser(username, password) {
        const crawler = await Crawler.init({
            apiEndpointData: this.apiEndpointData,
            pageData: this.pageData,
            config: this.config
        });
        if (username != 'Public' && password != null) {
            await crawler.login(username, password);
        }
        await crawler.startCrawling();
        await crawler.onIdle();
        await crawler.close();
        return;
    }
}
//# sourceMappingURL=users-crawler.js.map