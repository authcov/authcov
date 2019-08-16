const IntruderCredentialsGrabber = require('../intruder/intruder-credentials-grabber.js')
const ConfigValidator = require('../config/config-validator.js');
const mergeConfigs = require('../config/config-merger.js');

async function testLogin(configPath, cliOptions) {
  let config = require(configPath);
  config = mergeConfigs(config, cliOptions);

  // 1. Validate config
  configValidator = new ConfigValidator(config);
  if(configValidator.valid() === false) {
    console.log(configValidator.errorMessage());
    return;
  }

  // 2. Grab Credentials
  const credsGrabber = await IntruderCredentialsGrabber.init(config);

  let authHeaders = await credsGrabber.getAuthHeaders(config.crawlUser.username, config.crawlUser.password);

  console.log(`Testing the login to ${configPath}`)
  console.log(authHeaders);
  await credsGrabber.disconnect();
  return;
}

module.exports = testLogin;
