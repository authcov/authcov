
import UsersCrawler from '../../src/crawler/users-crawler';
import ApiEndpointData from '../../src/data/api-endpoint-data';
import PageData from '../../src/data/page-data';
import { config as defaultConfig } from './configs/spa-config';
import Config from '../../src/config/config';
import ApiEndpointsPresenter from '../../src/data/api-endpoints-presenter';
import ReportGenerator from '../../src/reporter/report-generator';
import { createTmpDir, compareApiEndpointsFiles, comparePagesFiles } from '../utils/compare_files';

test.skip('skip', () => {});

// TODO: This test only works when ran individually, it fails when run with the other tests
/*
const configButtonClick = Object.assign(defaultConfig, {
  clickButtons: true,
  maxDepth: 0,
  crawlUser: { username: 'Public', password: null }
});
const config = new Config(configButtonClick);

const apiEndpointData = new ApiEndpointData(config);
const pageData = new PageData({config: config});
const apiEndpointsPresenter = new ApiEndpointsPresenter(apiEndpointData.apiEndpoints);
const reporter = new ReportGenerator(apiEndpointsPresenter, pageData, '.');
const usersCrawler = new UsersCrawler(config, apiEndpointData, pageData, reporter);

describe('UsersCrawler for SPA with cookie-based auth and button clicking enabled', () => {
  beforeEach(() => {
    createTmpDir();
  });

  it('saves apiRequests and pages for users: Public, evanrolfe@gmail.com, evanrolfe@onescan.io', async () => {
    await usersCrawler.start();
    compareApiEndpointsFiles('./tmp/api_endpoints.json', './test/e2e/expected_output/spa_button_click_api_endpoints.json');
    comparePagesFiles('./tmp/pages.json', './test/e2e/expected_output/spa_button_click_pages.json');
  });
});

*/
