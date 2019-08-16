const chalk = require('chalk');

const ConfigValidator = require('../config/config-validator.js');
const mergeConfigs = require('../config/config-merger.js');
const UsersCrawler = require('../crawler/users-crawler.js');
const ApiEndpointData = require('../data/api-endpoint-data.js');
const PageData = require('../data/page-data.js');

const ReportGenerator = require('../reporter/report-generator.js');
const ApiEndpointsPresenter = require('../data/api-endpoints-presenter.js');

async function crawl(configPath, cliOptions) {
  let config = require(configPath);
  config = mergeConfigs(config, cliOptions);

  // 1. Validate config
  configValidator = new ConfigValidator(config);
  if(configValidator.valid() === false) {
    console.log(configValidator.errorMessage());
    return;
  }

  const apiEndpointData = new ApiEndpointData({config: config});
  const pageData = new PageData({config: config});
  const usersCrawler = new UsersCrawler(config, apiEndpointData, pageData);

  // 2. Crawl as the web app
  await usersCrawler.start();
  apiEndpointData.saveToFile(config.apiEndpointsFile);
  pageData.saveToFile(config.pagesFile);
  console.log(chalk.green('Finished crawling.'));

  // 3. Generate the report
  const apiEndpointsPresenter = new ApiEndpointsPresenter(apiEndpointData.apiEndpoints);
  const reporter = new ReportGenerator(apiEndpointsPresenter, pageData);
  reporter.generate(config.reportPath);
  return;
}

module.exports = crawl;
