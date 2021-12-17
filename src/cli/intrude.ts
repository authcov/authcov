import UsersIntruder from '../intruder/users-intruder';
import ApiEndpointData from '../data/api-endpoint-data';
import ConfigValidator from '../config/config-validator';
import { mergeConfigs } from '../config/config-merger';
import BaseConfig from '../config/base-config';
import PageData from '../data/page-data';
import ReportGenerator from '../reporter/report-generator';

export async function intrude(configPath, packagePath, cliOptions) {
  const c = await import(configPath);
  const configArgs = mergeConfigs(c.config, cliOptions);

  // 1. Validate config params
  const configValidator = new ConfigValidator(configArgs);
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
  const reporter = new ReportGenerator(apiEndpointData.apiEndpoints, pageData, packagePath);
  reporter.generate(config.reportPath);
  return;
}
