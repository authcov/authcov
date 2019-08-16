const UsersIntruder = require('../intruder/users-intruder.js');
const ApiEndpointData = require('../data/api-endpoint-data.js');

const ConfigValidator = require('../config/config-validator.js');
const mergeConfigs = require('../config/config-merger.js');
const PageData = require('../data/page-data.js');
const ReportGenerator = require('../reporter/report-generator.js');
const ApiEndpointsPresenter = require('../data/api-endpoints-presenter.js');

async function intrude(configPath, cliOptions) {
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

  // 2. Intrude
  apiEndpointData.loadFile(config.options.apiEndpointsFile);
  const usersIntruder = new UsersIntruder(config, apiEndpointData);
  await usersIntruder.start();

  // 3. Generate the report
  pageData.loadFile(config.options.pagesFile);
  const apiEndpointsPresenter = new ApiEndpointsPresenter(apiEndpointData.apiEndpoints);
  const reporter = new ReportGenerator(apiEndpointsPresenter, pageData);
  reporter.generate(config.options.reportPath);
  return;
}

module.exports = intrude;
