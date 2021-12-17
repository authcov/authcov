import UsersCrawler from '../../src/crawler/users-crawler';
import ApiEndpointData from '../../src/data/api-endpoint-data';
import PageData from '../../src/data/page-data';
import { config as configArgs } from './configs/spa-config';
import BaseConfig from '../../src/config/base-config';
import ApiEndpointsPresenter from '../../src/data/api-endpoints-presenter';
import ReportGenerator from '../../src/reporter/report-generator';
import { createTmpDir, compareApiEndpointsFiles, comparePagesFiles } from '../utils/compare_files';

describe('UsersCrawler for SPA with cookie-based auth', () => {
  beforeEach(() => {
    createTmpDir();
  });

  it('should stop waiting for API requests that take longer than the timeout limit', async () => {
    // Deep clone the config and set clickButtons to true
    const configButtonClick = Object.assign({}, configArgs);
    configButtonClick.crawlUser = {username: 'Public', password: null};
    configButtonClick.baseUrl = 'http://localhost/really_slow';
    configButtonClick.maxDepth = 0;
    const config = new BaseConfig(configButtonClick);

    const apiEndpointData = new ApiEndpointData({config: config});
    const pageData = new PageData({config: config});
    const apiEndpointsPresenter = new ApiEndpointsPresenter(apiEndpointData.apiEndpoints);
    const reporter = new ReportGenerator(apiEndpointsPresenter, pageData, '.');
    const usersCrawler = new UsersCrawler(config, apiEndpointData, pageData, reporter);

    await usersCrawler.start();
    compareApiEndpointsFiles('./tmp/api_endpoints.json', './test/e2e/expected_output/spa_timeout_api_endpoints.json');
    comparePagesFiles('./tmp/pages.json', './test/e2e/expected_output/spa_timeout_pages.json');
  });
});
