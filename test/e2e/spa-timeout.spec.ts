import UsersCrawler from '../../src/crawler/users-crawler';
import ApiEndpointsCollection from '../../src/data/api-endpoints-collection';
import PageData from '../../src/data/page-data';
import { config as configArgs } from './configs/spa-config';
import Config from '../../src/config/config';
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
    const config = new Config(configButtonClick);

    const apiEndpointData = new ApiEndpointsCollection(config);
    const pageData = new PageData({config: config});
    const reporter = new ReportGenerator(apiEndpointData.apiEndpoints, pageData, '.');
    const usersCrawler = new UsersCrawler(config, apiEndpointData, pageData, reporter);

    await usersCrawler.start();
    compareApiEndpointsFiles('./tmp/api_endpoints.json', './test/e2e/expected_output/spa_timeout_api_endpoints.json');
    comparePagesFiles('./tmp/pages.json', './test/e2e/expected_output/spa_timeout_pages.json');
  });
});

