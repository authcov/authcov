// TODO:
import ApiEndpointsCollection from '../data/api-endpoints-collection';
import PageData from '../data/page-data';
import ReportGenerator from '../reporter/report-generator';
import ApiEndpointsPresenter from '../data/api-endpoints-presenter';
const configPath = './examples/wordpress-config.js';
export async function report(configPath) {
    const config = require(configPath);
    const apiEndpointData = new ApiEndpointsCollection(config);
    const pageData = new PageData({ config: config });
    apiEndpointData.loadFile(config.apiEndpointsFile);
    pageData.loadFile(config.pagesFile);
    // 2. Generate the report
    const apiEndpointsPresenter = new ApiEndpointsPresenter(apiEndpointData.apiEndpoints);
    const reporter = new ReportGenerator(apiEndpointsPresenter, pageData, '.');
    reporter.generate(config.reportPath);
    return;
}
report(configPath);
//# sourceMappingURL=report.js.map