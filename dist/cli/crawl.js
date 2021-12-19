import chalk from 'chalk';
import ConfigValidator from '../config/config-validator';
import { mergeConfigs } from '../config/config-merger';
import Config from '../config/config';
import UsersCrawler from '../crawler/users-crawler';
import ApiEndpointData from '../data/api-endpoint-data';
import PageData from '../data/page-data';
import ReportGenerator from '../reporter/report-generator';
export async function crawl(configPath, packagePath, cliOptions) {
    const c = await import(configPath);
    const configArgs = mergeConfigs(c.config, cliOptions);
    // 1. Validate config params
    const configValidator = new ConfigValidator(configArgs);
    if (configValidator.valid() === false) {
        console.log(configValidator.errorMessage());
        return;
    }
    // 2. Setup
    const config = new Config(configArgs);
    const apiEndpointData = new ApiEndpointData({ config: config });
    const pageData = new PageData({ config: config });
    const reporter = new ReportGenerator(apiEndpointData.apiEndpoints, pageData, packagePath);
    const usersCrawler = new UsersCrawler(config, apiEndpointData, pageData, reporter);
    // 3. Crawl as the web app
    await usersCrawler.start();
    apiEndpointData.saveToFile(config.apiEndpointsFile);
    pageData.saveToFile(config.pagesFile);
    console.log(chalk.green('Finished crawling.'));
    // 4. Generate the report
    reporter.generate(config.reportPath);
}
//# sourceMappingURL=crawl.js.map