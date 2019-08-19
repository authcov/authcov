const IntruderCredentialsGrabber = require('../intruder/intruder-credentials-grabber.js')
const ConfigValidator = require('../config/config-validator.js');
const mergeConfigs = require('../config/config-merger.js');
const BaseConfig = require('../config/base-config.js');

async function testLogin(configPath, cliOptions) {
  let configArgs = require(configPath);
  configArgs = mergeConfigs(configArgs, cliOptions);

  // 1. Validate config params
  configValidator = new ConfigValidator(configArgs);
  if(configValidator.valid() === false) {
    console.log(configValidator.errorMessage());
    return;
  }

  // 2. Grab Credentials
  const config = new BaseConfig(configArgs);
  const credsGrabber = await IntruderCredentialsGrabber.init(config);

  let authHeaders = await credsGrabber.getAuthHeaders(config.crawlUser.username, config.crawlUser.password);

  console.log(`Testing the login to ${configPath}`)
  console.log(authHeaders);
  await credsGrabber.disconnect();
  return;
}

module.exports = testLogin;
