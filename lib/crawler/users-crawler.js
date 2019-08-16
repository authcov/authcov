const Crawler = require('./crawler.js');
const ReportGenerator = require('../reporter/report-generator.js')
const reporter = new ReportGenerator();

class UsersCrawler {
  constructor(config, apiEndpointData, pageData) {
    this.config = config;
    this.apiEndpointData = apiEndpointData;
    this.pageData = pageData;
  }

  async start() {
    reporter._clearReportDir();
    reporter._createReportDir();

    const startTime = Date.now();

    await this.crawlUser(this.config.options.crawlUser.username, this.config.options.crawlUser.password);

    this.apiEndpointData.saveToFile(this.config.options.apiEndpointsFile);
    this.pageData.saveToFile(this.config.options.pagesFile);

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

    if(username != 'Public' && password != null) {
      await crawler.login(username, password);
    }
    await crawler.startCrawling();
    await crawler.onIdle();
    await crawler.close();
    return;
  }
}

module.exports = UsersCrawler;
