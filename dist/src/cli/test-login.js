import IntruderCredentialsGrabber from '../intruder/intruder-credentials-grabber';
import ConfigValidator from '../config/config-validator';
import { mergeConfigs } from '../config/config-merger';
import BaseConfig from '../config/base-config';
export async function testLogin(configPath, cliOptions) {
    let configArgs = require(configPath);
    configArgs = mergeConfigs(configArgs, cliOptions);
    // 1. Validate config params
    const configValidator = new ConfigValidator(configArgs);
    if (configValidator.valid() === false) {
        console.log(configValidator.errorMessage());
        return;
    }
    // 2. Grab Credentials
    const config = new BaseConfig(configArgs);
    const credsGrabber = await IntruderCredentialsGrabber.init(config);
    console.log(`Logging in as user: ${config.crawlUser.username}...`);
    let authHeaders = await credsGrabber.getAuthHeaders(config.crawlUser.username, config.crawlUser.password);
    console.log('Got the following authorisation headers:');
    console.log(authHeaders);
    await credsGrabber.disconnect();
    return;
}
//# sourceMappingURL=test-login.js.map