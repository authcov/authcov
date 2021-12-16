export {};
// TODO:
const ApiEndpointData = require('../data/api-endpoint-data.js');
const PageData = require('../data/page-data.js');

const ReportGenerator = require('../reporter/report-generator.js');
const ApiEndpointsPresenter = require('../data/api-endpoints-presenter.js');

const configPath = './examples/wordpress-config.js';

async function report(configPath) {
  const config = require(configPath);
  const apiEndpointData = new ApiEndpointData({config: config});
  const pageData = new PageData({config: config});

  apiEndpointData.loadFile(config.apiEndpointsFile);
  pageData.loadFile(config.pagesFile);

  // 2. Generate the report
  const apiEndpointsPresenter = new ApiEndpointsPresenter(apiEndpointData.apiEndpoints);
  const reporter = new ReportGenerator(apiEndpointsPresenter, pageData);
  reporter.generate(config.reportPath);
  return;
}

module.exports = report;

report(configPath);
