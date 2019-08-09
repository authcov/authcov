const UsersIntruder = require('../intruder/users-intruder.js');
const ApiEndpointData = require('../data/api-endpoint-data.js');

const PageData = require('../data/page-data.js');
const ReportGenerator = require('../reporter/report-generator.js');
const ApiEndpointsPresenter = require('../data/api-endpoints-presenter.js');

async function intrude(configPath) {
  const config = require(configPath);
  const apiEndpointData = new ApiEndpointData({config: config});
  const pageData = new PageData({config: config});

  // 1. Intrude
  apiEndpointData.loadFile(config.options.apiEndpointsFile);
  const usersIntruder = new UsersIntruder(config, apiEndpointData);
  await usersIntruder.start();

  // 2. Generate the report
  pageData.loadFile(config.options.pagesFile);
  const apiEndpointsPresenter = new ApiEndpointsPresenter(apiEndpointData.apiEndpoints);
  const reporter = new ReportGenerator(apiEndpointsPresenter, pageData);
  reporter.generate(config.options.reportPath);
  return;
}

module.exports = intrude;
