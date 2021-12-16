export {};
const chalk = require('chalk');

const ConfigValidator = require('../config/config-validator.js');
const mergeConfigs = require('../config/config-merger.js');
const BaseConfig = require('../config/base-config.js');
const UsersCrawler = require('../crawler/users-crawler.js');
const ApiEndpointData = require('../data/api-endpoint-data.js');
const PageData = require('../data/page-data.js');
const ReportGenerator = require('../reporter/report-generator.js');

async function crawl(configPath, packagePath, cliOptions) {
  let configArgs = require(configPath);
  configArgs = mergeConfigs(configArgs, cliOptions);

  // 1. Validate config params
  const configValidator = new ConfigValidator(configArgs);
  if(configValidator.valid() === false) {
    console.log(configValidator.errorMessage());
    return;
  }

  // 2. Setup
  const config = new BaseConfig(configArgs);
  const apiEndpointData = new ApiEndpointData({config: config});
  const pageData = new PageData({config: config});
  const reporter = new ReportGenerator(apiEndpointData.apiEndpoints, pageData, packagePath);
  const usersCrawler = new UsersCrawler(config, apiEndpointData, pageData, reporter);

  // 3. Crawl as the web app
  await usersCrawler.start();
  apiEndpointData.saveToFile(config.apiEndpointsFile);
  pageData.saveToFile(config.pagesFile);
  console.log(chalk.green('Finished crawling.'));

  // 4. Generate the report
  reporter.generate(config.reportPath);
  return;
}

module.exports = crawl;
