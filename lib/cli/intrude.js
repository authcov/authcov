const UsersIntruder = require('../intruder/users-intruder.js');
const ApiEndpointData = require('../data/api-endpoint-data.js');
const ConfigValidator = require('../config/config-validator.js');
const mergeConfigs = require('../config/config-merger.js');
const BaseConfig = require('../config/base-config.js');
const PageData = require('../data/page-data.js');
const ReportGenerator = require('../reporter/report-generator.js');

async function intrude(configPath, cliOptions) {
  let configArgs = require(configPath);
  configArgs = mergeConfigs(configArgs, cliOptions);

  // 1. Validate config params
  configValidator = new ConfigValidator(configArgs);
  if(configValidator.valid() === false) {
    console.log(configValidator.errorMessage());
    return;
  }

  const config = new BaseConfig(configArgs);
  const apiEndpointData = new ApiEndpointData({config: config});
  const pageData = new PageData({config: config});

  // 2. Intrude
  apiEndpointData.loadFile(config.apiEndpointsFile);
  const usersIntruder = new UsersIntruder(config, apiEndpointData);
  await usersIntruder.start();

  // 3. Generate the report
  pageData.loadFile(config.pagesFile);
  const reporter = new ReportGenerator(apiEndpointData.apiEndpoints, pageData);
  reporter.generate(config.reportPath);
  return;
}

module.exports = intrude;
