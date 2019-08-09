const UsersCrawler = require('../crawler/users-crawler.js');
const ApiEndpointData = require('../data/api-endpoint-data.js');
const PageData = require('../data/page-data.js');

const ReportGenerator = require('../reporter/report-generator.js');
const ApiEndpointsPresenter = require('../data/api-endpoints-presenter.js');

async function crawl(configPath) {
  const config = require(configPath);
  const apiEndpointData = new ApiEndpointData({config: config});
  const pageData = new PageData({config: config});
  const usersCrawler = new UsersCrawler(config, apiEndpointData, pageData);

  // 1. Crawl as the web app
  await usersCrawler.start();
  apiEndpointData.saveToFile('./tmp/api_endpoints.json');
  pageData.saveToFile('./tmp/pages.json');
  console.log('Finished crawling.');

  // 2. Generate the report
  const apiEndpointsPresenter = new ApiEndpointsPresenter(apiEndpointData.apiEndpoints);
  const reporter = new ReportGenerator(apiEndpointsPresenter, pageData);
  reporter.generate('./tmp/report');
  console.log(`Generated report.`);
  return;
}

module.exports = crawl;
