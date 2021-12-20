import Crawler from './crawler';
import ApiEndpointsCollection from '../data/api-endpoints-collection';
import PageData from '../data/page-data';
import ReportGenerator from '../reporter/report-generator';
import Config from '../config/config';

export default class UsersCrawler {
  config: Config;
  apiEndpointData: ApiEndpointsCollection;
  pageData: PageData;
  reporter: ReportGenerator;

  constructor(
    config: Config,
    apiEndpointData: ApiEndpointsCollection,
    pageData: PageData,
    reporter: ReportGenerator
  ) {
    this.config = config;
    this.apiEndpointData = apiEndpointData;
    this.pageData = pageData;
    this.reporter = reporter;
  }

  async start() {
    // this.reporter._clearReportDir();
    // this.reporter._createReportDir();

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

    if(username != 'Public' && password != null) {
      await crawler.login(username, password);
    }
    await crawler.startCrawling();
    await crawler.onIdle();
    await crawler.close();
    return;
  }
}
